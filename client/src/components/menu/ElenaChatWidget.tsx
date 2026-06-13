import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { apiRequest } from "@/lib/queryClient";
import { useLanguage } from "@/contexts/LanguageContext";

const INK = "#0a0a0a";
const ORANGE = "#e87722";
const CREAM = "#f5f0e8";
const MUTED = "#8a8070";

interface Message {
  role: "assistant" | "user";
  text: string;
  reservation?: Record<string, unknown> | null;
}

interface ChatResponse {
  sessionId: string;
  reply: string;
  state: string;
  mode: string;
  quickReplies?: string[];
  reservation?: Record<string, unknown> | null;
}

function TypingIndicator() {
  return (
    <div style={{ display: "flex", gap: "5px", padding: "10px 12px", alignItems: "center" }}>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          style={{ width: 7, height: 7, borderRadius: "50%", background: ORANGE, display: "block" }}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </div>
  );
}

function Bubble({ msg }: { msg: Message }) {
  const isUser = msg.role === "user";
  return (
    <div style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start", marginBottom: 8 }}>
      <div
        style={{
          maxWidth: "82%",
          background: isUser ? ORANGE : CREAM,
          color: INK,
          borderRadius: 4,
          border: `2px solid ${INK}`,
          boxShadow: `3px 3px 0 ${INK}`,
          padding: "8px 12px",
          fontSize: 13,
          lineHeight: 1.45,
          fontFamily: "sans-serif",
          whiteSpace: "pre-wrap",
        }}
        dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>") }}
      />
    </div>
  );
}

function ReservationCard({ res }: { res: Record<string, unknown> }) {
  return (
    <div
      style={{
        background: "rgba(232,119,34,0.08)",
        border: `2px solid ${ORANGE}`,
        borderRadius: 4,
        padding: "10px 12px",
        margin: "8px 0",
        fontFamily: "monospace",
        fontSize: 11,
      }}
    >
      <div style={{ color: ORANGE, fontWeight: 700, fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 4 }}>
        Reservering bevestigd
      </div>
      <div style={{ color: INK }}>
        {String(res.date)} om {String(res.time)} · {String(res.partySize)} pers. · {String(res.guestName)}
      </div>
    </div>
  );
}

export default function ElenaChatWidget() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Goedemiddag! Ik ben Elena van Eetcafé Full House. Wilt u een tafel reserveren, of heeft u een vraag over het menu of de openingstijden?",
    },
  ]);
  const [quickReplies, setQuickReplies] = useState<string[]>([
    "Tafel reserveren", "Menu vragen", "Openingstijden",
  ]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const sessionId = useRef<string>(crypto.randomUUID());
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, pending]);

  async function send(text: string) {
    if (!text.trim() || pending) return;
    const userMsg: Message = { role: "user", text };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setQuickReplies([]);
    setPending(true);
    try {
      const res = await apiRequest("POST", "/api/elena/chat", { sessionId: sessionId.current, message: text });
      const data: ChatResponse = await res.json();
      sessionId.current = data.sessionId; // server is authoritative — keeps the conversation in one session
      const botMsg: Message = { role: "assistant", text: data.reply, reservation: data.reservation };
      setMessages((m) => [...m, botMsg]);
      setQuickReplies(data.quickReplies ?? []);
    } catch {
      setMessages((m) => [...m, { role: "assistant", text: "Er is iets misgegaan. Bel ons op +31 320 282 428." }]);
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      {/* Floating button */}
      <div
        className="elena-chat-noprint"
        style={{ position: "fixed", bottom: 24, right: 24, zIndex: 60 }}
      >
        <AnimatePresence>
          {!open && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              onClick={() => setOpen(true)}
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: ORANGE,
                border: `3px solid ${INK}`,
                boxShadow: `4px 4px 0 ${INK}`,
                cursor: "pointer",
                fontFamily: "'Playfair Display', serif",
                fontWeight: 900,
                fontSize: 22,
                color: INK,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              E.
            </motion.button>
          )}
        </AnimatePresence>

        {/* Chat panel */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              style={{
                position: "fixed",
                bottom: 24,
                right: 24,
                width: 360,
                maxHeight: "72vh",
                background: "#0f0f0f",
                border: `2px solid ${ORANGE}`,
                borderRadius: 6,
                boxShadow: `5px 5px 0 ${INK}`,
                display: "flex",
                flexDirection: "column",
                zIndex: 61,
                overflow: "hidden",
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 14px",
                  borderBottom: `2px solid rgba(232,119,34,0.25)`,
                  background: "#0a0a0a",
                }}
              >
                <div>
                  <div style={{ fontFamily: "monospace", fontWeight: 700, fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: ORANGE }}>
                    Elena
                  </div>
                  <div style={{ fontFamily: "monospace", fontSize: 9, color: MUTED, letterSpacing: "0.1em" }}>
                    Eetcafé Full House · Lelystad
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  style={{ background: "none", border: "none", color: MUTED, fontSize: 18, cursor: "pointer", lineHeight: 1 }}
                >
                  ×
                </button>
              </div>

              {/* Messages */}
              <div style={{ flex: 1, overflowY: "auto", padding: "12px 12px 0" }}>
                {messages.map((msg, i) => (
                  <div key={i}>
                    <Bubble msg={msg} />
                    {msg.reservation && <ReservationCard res={msg.reservation} />}
                  </div>
                ))}
                {pending && (
                  <div style={{ display: "flex", justifyContent: "flex-start" }}>
                    <div style={{ background: CREAM, border: `2px solid ${INK}`, borderRadius: 4, boxShadow: `3px 3px 0 ${INK}` }}>
                      <TypingIndicator />
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Quick replies */}
              {quickReplies.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, padding: "8px 12px 0" }}>
                  {quickReplies.map((qr) => (
                    <button
                      key={qr}
                      onClick={() => send(qr)}
                      disabled={pending}
                      style={{
                        fontFamily: "monospace",
                        fontSize: 10,
                        letterSpacing: "0.08em",
                        background: "none",
                        border: `1.5px solid ${ORANGE}`,
                        borderRadius: 3,
                        color: ORANGE,
                        padding: "3px 8px",
                        cursor: "pointer",
                        opacity: pending ? 0.5 : 1,
                      }}
                    >
                      {qr}
                    </button>
                  ))}
                </div>
              )}

              {/* Input */}
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  padding: "10px 12px",
                  borderTop: `2px solid rgba(232,119,34,0.2)`,
                  marginTop: 8,
                }}
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && send(input)}
                  placeholder={t("chat.placeholder") || "Schrijf een bericht..."}
                  disabled={pending}
                  style={{
                    flex: 1,
                    background: "#1a1a1a",
                    border: `1.5px solid rgba(232,119,34,0.35)`,
                    borderRadius: 3,
                    color: CREAM,
                    fontFamily: "monospace",
                    fontSize: 12,
                    padding: "7px 10px",
                    outline: "none",
                  }}
                />
                <button
                  onClick={() => send(input)}
                  disabled={pending || !input.trim()}
                  style={{
                    background: ORANGE,
                    border: `2px solid ${INK}`,
                    borderRadius: 3,
                    boxShadow: `2px 2px 0 ${INK}`,
                    color: INK,
                    fontFamily: "monospace",
                    fontWeight: 700,
                    fontSize: 11,
                    padding: "0 12px",
                    cursor: "pointer",
                    opacity: pending || !input.trim() ? 0.5 : 1,
                  }}
                >
                  {t("chat.send") || "Stuur"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
