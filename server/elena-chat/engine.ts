import { v4 as uuidv4 } from "uuid";
import type { ChatSession, ChatState, ChatSlots, ChatTurnResult, CreateReservationFn } from "./types";
import {
  parseDate, parseTime, parsePartySize, parsePhone,
  detectIntent, isClosed, isPast, isValidTime, formatDateNL, isYes, isNo,
} from "./nlu";
import { answerMenuQuestion, answerHoursQuestion } from "./menu-answers";

const MAX_SESSIONS = 500;
const SESSION_TTL_MS = 30 * 60 * 1000;
let lastSweep = Date.now();

const sessions = new Map<string, ChatSession>();

function sweepExpired(): void {
  const now = Date.now();
  if (now - lastSweep < 60_000) return;
  lastSweep = now;
  for (const [id, s] of Array.from(sessions.entries())) {
    if (now - s.lastActivity > SESSION_TTL_MS) sessions.delete(id);
  }
}

function getOrCreate(sessionId?: string): ChatSession {
  sweepExpired();
  // Adopt a client-supplied id (the widget generates a UUID) so the
  // conversation survives even if the client never syncs the returned id.
  const id = sessionId && /^[\w-]{8,64}$/.test(sessionId) ? sessionId : uuidv4();
  if (!sessions.has(id)) {
    if (sessions.size >= MAX_SESSIONS) {
      let oldest = "";
      let oldestTime = Infinity;
      for (const [k, v] of Array.from(sessions.entries())) {
        if (v.lastActivity < oldestTime) { oldest = k; oldestTime = v.lastActivity; }
      }
      if (oldest) sessions.delete(oldest);
    }
    sessions.set(id, { id, state: "idle", slots: {}, history: [], lastActivity: Date.now() });
  }
  return sessions.get(id)!;
}

function nextMissingSlotState(slots: ChatSlots): ChatState {
  if (!slots.date) return "collect_date";
  if (!slots.time) return "collect_time";
  if (!slots.partySize) return "collect_party";
  if (!slots.guestName) return "collect_name";
  if (!slots.guestPhone) return "collect_phone";
  return "confirm";
}

function askForState(state: ChatState, slots: ChatSlots): { text: string; quickReplies: string[] } {
  switch (state) {
    case "collect_date":
      return { text: "Voor welke datum wilt u reserveren?", quickReplies: ["Vandaag", "Morgen", "Vrijdag"] };
    case "collect_time":
      return { text: "Hoe laat wilt u komen? Wij zijn open van 11:00 tot 22:00.", quickReplies: ["18:00", "19:00", "20:00"] };
    case "collect_party":
      return { text: "Met hoeveel personen komt u?", quickReplies: ["2 personen", "4 personen", "6 personen"] };
    case "collect_name":
      return { text: "Op welke naam mag ik de reservering zetten?", quickReplies: [] };
    case "collect_phone":
      return { text: "Op welk telefoonnummer kunnen wij u bereiken?", quickReplies: [] };
    case "confirm": {
      const dateFmt = slots.date ? formatDateNL(slots.date) : "?";
      return {
        text: `Ik heb genoteerd: **${dateFmt} om ${slots.time}, ${slots.partySize} personen, op naam van ${slots.guestName}** (${slots.guestPhone}). Klopt dit?`,
        quickReplies: ["Ja, klopt!", "Nee, wijzig"],
      };
    }
    case "done":
      return { text: "Uw reservering staat genoteerd! Tot snel bij Full House! 🍽️", quickReplies: ["Nieuwe reservering", "Menu vragen"] };
    default:
      return { text: "Waarmee kan ik u helpen?", quickReplies: ["Tafel reserveren", "Menu vragen", "Openingstijden"] };
  }
}

export async function runRulesEngine(
  session: ChatSession,
  userMessage: string,
  createReservation: CreateReservationFn
): Promise<ChatTurnResult> {
  const slots = session.slots;
  let state = session.state;

  // Opportunistic slot filling: run all extractors on every message
  const consumed = new Set<string>();
  const dateVal = parseDate(userMessage);
  const timeVal = parseTime(userMessage);
  // Mark date/time digits as consumed BEFORE party parsing to avoid "19:00" → 19 persons
  if (timeVal) { const m = userMessage.match(/\b(\d{1,2})\b/g); if (m) m.forEach((n) => consumed.add(n)); }
  if (dateVal) { const m = userMessage.match(/\b(\d{1,4})\b/g); if (m) m.forEach((n) => consumed.add(n)); }
  const partyVal = parsePartySize(userMessage, consumed);
  const phoneVal = parsePhone(userMessage);

  // Apply slots
  let dateError: string | null = null;
  let timeError: string | null = null;

  if (dateVal && !slots.date) {
    if (isClosed(dateVal)) {
      dateError = `Op maandag zijn wij gesloten — dinsdag kan wel! Voor welke andere datum?`;
    } else if (isPast(dateVal)) {
      dateError = "Die datum is al voorbij. Voor welke datum wilt u reserveren?";
    } else {
      slots.date = dateVal;
    }
  }
  if (timeVal && !slots.time) {
    if (!isValidTime(timeVal)) {
      timeError = `Wij zijn open van 11:00 tot 22:00 (laatste reservering 21:30). Hoe laat wilt u komen?`;
    } else if (slots.date && isPast(slots.date, timeVal)) {
      timeError = "Dat tijdstip is al voorbij vandaag. Kiest u een later tijdstip?";
    } else {
      slots.time = timeVal;
    }
  }
  if (partyVal && !slots.partySize) {
    slots.partySize = partyVal;
    if (partyVal >= 8) {
      slots.notes = `Grote groep: ${partyVal} personen. Jan neemt mogelijk contact op.`;
    }
  }
  if (phoneVal && !slots.guestPhone && state === "collect_phone") {
    slots.guestPhone = phoneVal;
  }

  // --- State: idle ---
  if (state === "idle") {
    const intent = detectIntent(userMessage);

    if (intent === "hours") {
      return result(session, "idle", answerHoursQuestion() + "\n\nWaarmee kan ik u anders helpen?", ["Tafel reserveren", "Menu vragen"]);
    }
    if (intent === "cancel") {
      return result(session, "idle", "Voor annuleren belt u ons op **+31 320 282 428** of stuur een berichtje. Waarmee kan ik u helpen?", ["Tafel reserveren"]);
    }
    if (intent === "menu") {
      const ans = answerMenuQuestion(userMessage);
      const reply = (ans ?? "Onze kaart staat op /prenota.") + "\n\nKan ik ook een tafel voor u reserveren?";
      return result(session, "idle", reply, ["Tafel reserveren", "Openingstijden"]);
    }
    if (intent === "book" || dateVal || timeVal || partyVal) {
      state = nextMissingSlotState(slots);
      session.state = state;
      const { text, quickReplies } = askForState(state, slots);
      if (state === "confirm") {
        // All slots filled in one shot
        return result(session, state, text, quickReplies);
      }
      return result(session, state, text, quickReplies);
    }

    // Greeting
    return result(session, "idle",
      "Goedemiddag! Ik ben Elena van Eetcafé Full House. Wilt u een tafel reserveren, of heeft u een vraag over het menu of de openingstijden?",
      ["Tafel reserveren", "Menu vragen", "Openingstijden"]);
  }

  // --- Collecting states ---
  if (state === "collect_date") {
    if (dateError) return result(session, state, dateError, ["Morgen", "Vrijdag", "Zaterdag"]);
    if (slots.date) {
      state = nextMissingSlotState(slots);
      session.state = state;
      const sideAns = maybeSideAnswer(userMessage);
      const { text, quickReplies } = askForState(state, slots);
      return result(session, state, (sideAns ? sideAns + "\n\n" : "") + text, quickReplies);
    }
    // Correction attempt on wrong state? Re-ask
    return result(session, state, "Ik heb die datum helaas niet begrepen. " + askForState(state, slots).text, askForState(state, slots).quickReplies);
  }

  if (state === "collect_time") {
    if (timeError) return result(session, state, timeError, ["18:00", "19:00", "20:00"]);
    if (slots.time) {
      state = nextMissingSlotState(slots);
      session.state = state;
      const sideAns = maybeSideAnswer(userMessage);
      const { text, quickReplies } = askForState(state, slots);
      return result(session, state, (sideAns ? sideAns + "\n\n" : "") + text, quickReplies);
    }
    const sideAns = maybeSideAnswer(userMessage);
    const q = askForState(state, slots);
    const prefix = sideAns ? sideAns + "\n\nVerder met uw reservering: " : "";
    return result(session, state, prefix + q.text, q.quickReplies);
  }

  if (state === "collect_party") {
    if (slots.partySize) {
      state = nextMissingSlotState(slots);
      session.state = state;
      const sideAns = maybeSideAnswer(userMessage);
      const { text, quickReplies } = askForState(state, slots);
      return result(session, state, (sideAns ? sideAns + "\n\n" : "") + text, quickReplies);
    }
    const sideAns = maybeSideAnswer(userMessage);
    const q = askForState(state, slots);
    return result(session, state, (sideAns ? sideAns + "\n\nVerder: " : "") + q.text, q.quickReplies);
  }

  if (state === "collect_name") {
    const cleaned = userMessage.trim().replace(/[0-9?]/g, "").trim();
    if (cleaned.length >= 2 && cleaned.length <= 60) {
      slots.guestName = cleaned;
      state = nextMissingSlotState(slots);
      session.state = state;
      const { text, quickReplies } = askForState(state, slots);
      return result(session, state, text, quickReplies);
    }
    return result(session, state, "Kunt u uw naam invullen? (Alleen letters, minimaal 2 tekens.)", []);
  }

  if (state === "collect_phone") {
    if (slots.guestPhone) {
      state = "confirm";
      session.state = state;
      const { text, quickReplies } = askForState(state, slots);
      return result(session, state, text, quickReplies);
    }
    return result(session, state, "Ik heb dat telefoonnummer niet begrepen. Kunt u een geldig Nederlands nummer opgeven? Bijv. 06 12 34 56 78.", []);
  }

  // --- Confirm ---
  if (state === "confirm") {
    if (isYes(userMessage)) {
      const reservationData = {
        guestName: slots.guestName!,
        guestPhone: slots.guestPhone!,
        date: slots.date!,
        time: slots.time!,
        partySize: slots.partySize!,
        notes: slots.notes ?? null,
        status: "pending",
        tableId: null,
      };
      let reservation = null;
      try {
        reservation = await createReservation(reservationData);
      } catch {
        return result(session, state, "Er is iets misgegaan bij het opslaan. Bel ons op +31 320 282 428.", ["Probeer opnieuw"]);
      }
      session.state = "done";
      return {
        sessionId: session.id,
        reply: "Uw reservering staat genoteerd! Jan bevestigt hem persoonlijk. Tot snel bij Eetcafé Full House!",
        state: "done",
        mode: "rules",
        quickReplies: ["Nieuwe reservering", "Menu vragen"],
        draft: slots,
        action: { type: "create_reservation" as const, data: reservationData },
        // Pass reservation back via action so route can broadcast
        ...(reservation ? { _reservation: reservation } : {}),
      } as unknown as ChatTurnResult;
    }

    if (isNo(userMessage)) {
      // Detect which slot they want to change
      const s = userMessage.toLowerCase();
      if (/datum|dag/.test(s)) { delete slots.date; session.state = "collect_date"; }
      else if (/tijd|uur|laat/.test(s)) { delete slots.time; session.state = "collect_time"; }
      else if (/personen|aantal/.test(s)) { delete slots.partySize; session.state = "collect_party"; }
      else if (/naam/.test(s)) { delete slots.guestName; session.state = "collect_name"; }
      else if (/nummer|telefoon/.test(s)) { delete slots.guestPhone; session.state = "collect_phone"; }
      else { session.state = "collect_date"; delete slots.date; }

      const { text, quickReplies } = askForState(session.state, slots);
      return result(session, session.state, "Geen probleem! " + text, quickReplies);
    }

    // Re-show confirm if unclear
    const { text, quickReplies } = askForState("confirm", slots);
    return result(session, "confirm", text, quickReplies);
  }

  // --- Done: allow restart ---
  if (state === "done") {
    const intent = detectIntent(userMessage);
    if (intent === "book") {
      session.slots = {};
      session.state = "idle";
      return result(session, "idle",
        "Natuurlijk! Voor welke datum wilt u een nieuwe reservering maken?",
        ["Vandaag", "Morgen", "Vrijdag"]);
    }
    if (intent === "menu") {
      const ans = answerMenuQuestion(userMessage);
      return result(session, "done", ans ?? "Onze kaart staat op /prenota.", ["Nieuwe reservering"]);
    }
    if (intent === "hours") {
      return result(session, "done", answerHoursQuestion(), ["Nieuwe reservering"]);
    }
    return result(session, "done", "Uw reservering staat al genoteerd! Is er nog iets anders?", ["Nieuwe reservering", "Menu vragen"]);
  }

  return result(session, state, "Waarmee kan ik u helpen?", ["Tafel reserveren", "Menu vragen", "Openingstijden"]);
}

function maybeSideAnswer(userMessage: string): string | null {
  const intent = detectIntent(userMessage);
  if (intent === "menu") return answerMenuQuestion(userMessage);
  if (intent === "hours") return answerHoursQuestion();
  return null;
}

function result(session: ChatSession, state: ChatState, reply: string, quickReplies: string[]): ChatTurnResult {
  session.state = state;
  session.lastActivity = Date.now();
  return { sessionId: session.id, reply, state, mode: "rules", quickReplies, draft: session.slots };
}

export { getOrCreate };
