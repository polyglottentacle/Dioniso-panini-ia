import { buildElenaSystemPrompt } from "../elena-brain";
import { FULL_HOUSE_MENU } from "../../shared/menu-data";
import type { ChatSession, ChatTurnResult, CreateReservationFn } from "./types";

const MODEL = "claude-haiku-4-5-20251001";
const TIMEOUT_MS = 5000;

function buildMenuSummary(): string {
  const lines: string[] = [];
  const cats = ["starter", "main", "coffee", "drink", "wine"] as const;
  for (const cat of cats) {
    const items = FULL_HOUSE_MENU.filter((i) => i.category === cat);
    if (!items.length) continue;
    lines.push(`\n**${cat.toUpperCase()}**: ${items.map((i) => `${i.name} €${i.price.toFixed(2)}`).join(", ")}`);
  }
  return lines.join("");
}

const CREATE_TOOL = {
  name: "create_reservation",
  description: "Sla een reservering op zodra alle verplichte velden bevestigd zijn door de gast.",
  input_schema: {
    type: "object" as const,
    properties: {
      guestName: { type: "string", description: "Naam van de gast" },
      guestPhone: { type: "string", description: "Telefoonnummer van de gast" },
      date: { type: "string", description: "Datum in formaat YYYY-MM-DD" },
      time: { type: "string", description: "Tijd in formaat HH:MM" },
      partySize: { type: "integer", description: "Aantal personen (1-20)" },
      notes: { type: "string", description: "Eventuele opmerkingen (optioneel)" },
    },
    required: ["guestName", "guestPhone", "date", "time", "partySize"],
  },
};

export async function runLLMEngine(
  session: ChatSession,
  userMessage: string,
  createReservation: CreateReservationFn,
  apiKey: string
): Promise<ChatTurnResult> {
  const today = new Date();
  const weekday = today.toLocaleDateString("nl-NL", { weekday: "long" });
  const dateStr = today.toISOString().split("T")[0];

  const systemPrompt =
    buildElenaSystemPrompt({
      restaurantName: "Eetcafé Full House",
      ownerName: "Jan",
      voicePersona: "elena",
      openingHours: "Dinsdag t/m zondag 11:00–22:00. Maandag gesloten.",
    }) +
    `\n\nDit is een chatgesprek op de website, geen telefoongesprek. Vandaag is ${dateStr} (${weekday}). Gebruik de tool create_reservation zodra naam, telefoonnummer, datum (YYYY-MM-DD), tijd (HH:MM) en personen bevestigd zijn. Verzin geen bevestiging zonder de tool te gebruiken.\n\nMENU OVERZICHT:${buildMenuSummary()}`;

  // Cap history at 20 messages
  const history = session.history.slice(-20);
  history.push({ role: "user", content: userMessage });

  const body = {
    model: MODEL,
    max_tokens: 500,
    system: systemPrompt,
    messages: history,
    tools: [CREATE_TOOL],
  };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let raw: Response;
  try {
    raw = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
  } catch {
    throw new Error("fetch_failed");
  } finally {
    clearTimeout(timer);
  }

  if (!raw.ok) throw new Error(`api_error_${raw.status}`);

  const data = await raw.json() as Record<string, unknown>;

  // Handle tool use
  let reply = "";
  let toolInput: Record<string, unknown> | null = null;
  let reservation = null;

  const content = data.content as Array<Record<string, unknown>>;
  for (const block of content) {
    if (block.type === "text") reply += (block.text as string);
    if (block.type === "tool_use" && block.name === "create_reservation") {
      toolInput = block.input as Record<string, unknown>;
    }
  }

  if (toolInput) {
    try {
      reservation = await createReservation(toolInput);
      // Get follow-up text from model
      const followMessages = [
        ...history,
        { role: "assistant" as const, content: content as unknown as string },
        { role: "user" as const, content: JSON.stringify([{ type: "tool_result", tool_use_id: (content.find((b) => b.type === "tool_use") as Record<string, unknown>)?.id, content: "Reservering succesvol aangemaakt." }]) },
      ];
      const followController = new AbortController();
      const followTimer = setTimeout(() => followController.abort(), TIMEOUT_MS);
      try {
        const followRaw = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: { "x-api-key": apiKey, "anthropic-version": "2023-06-01", "content-type": "application/json" },
          body: JSON.stringify({ model: MODEL, max_tokens: 300, system: systemPrompt, messages: followMessages }),
          signal: followController.signal,
        });
        if (followRaw.ok) {
          const followData = await followRaw.json() as Record<string, unknown>;
          const followContent = followData.content as Array<Record<string, unknown>>;
          reply = followContent.filter((b) => b.type === "text").map((b) => b.text as string).join("");
        }
      } finally {
        clearTimeout(followTimer);
      }
    } catch {
      reply = "Uw reservering staat genoteerd! Jan bevestigt hem persoonlijk. Tot snel bij Eetcafé Full House!";
    }
  }

  // Update history
  session.history = history;
  session.history.push({ role: "assistant", content: reply });
  session.lastActivity = Date.now();

  return {
    sessionId: session.id,
    reply: reply || "Ik begrijp u. Waarmee kan ik u verder helpen?",
    state: reservation ? "done" : session.state,
    mode: "llm",
    quickReplies: reservation ? ["Nieuwe reservering", "Menu vragen"] : [],
    draft: session.slots,
    ...(reservation ? { action: { type: "create_reservation" as const, data: toolInput ?? {} } } : {}),
    ...((reservation as unknown) ? { _reservation: reservation } : {}),
  } as unknown as ChatTurnResult;
}
