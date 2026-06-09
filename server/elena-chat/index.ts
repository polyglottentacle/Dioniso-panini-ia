import type { CreateReservationFn, ChatTurnResult } from "./types";
import { getOrCreate, runRulesEngine } from "./engine";
import { runLLMEngine } from "./llm";

export async function handleChatTurn(
  sessionId: string | undefined,
  message: string,
  createReservation: CreateReservationFn
): Promise<ChatTurnResult & { _reservation?: unknown }> {
  const session = getOrCreate(sessionId);
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (apiKey) {
    try {
      return await runLLMEngine(session, message, createReservation, apiKey) as ChatTurnResult & { _reservation?: unknown };
    } catch {
      // Silent fallback to rules
    }
  }

  return await runRulesEngine(session, message, createReservation) as ChatTurnResult & { _reservation?: unknown };
}
