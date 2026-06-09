import type { Reservation } from "../../shared/schema";

export type ChatState =
  | "idle"
  | "collect_date"
  | "collect_time"
  | "collect_party"
  | "collect_name"
  | "collect_phone"
  | "confirm"
  | "done";

export interface ChatSlots {
  date?: string;      // ISO YYYY-MM-DD
  time?: string;      // HH:MM
  partySize?: number;
  guestName?: string;
  guestPhone?: string;
  notes?: string;
}

export interface ChatSession {
  id: string;
  state: ChatState;
  slots: ChatSlots;
  history: { role: "user" | "assistant"; content: string }[];
  lastActivity: number;
}

export interface ChatTurnResult {
  sessionId: string;
  reply: string;
  state: ChatState;
  mode: "llm" | "rules";
  quickReplies?: string[];
  draft?: ChatSlots;
  action?: { type: "create_reservation"; data: Record<string, unknown> };
}

export type CreateReservationFn = (data: Record<string, unknown>) => Promise<Reservation>;
