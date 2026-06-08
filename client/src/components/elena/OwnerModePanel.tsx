import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useAudioContext } from "@/contexts/AudioContext";
import { useAudio } from "@/hooks/use-audio";

interface OwnerModePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface BriefingStats {
  reservationsToday: number;
  totalCovers: number;
  pending: number;
  tips: string[];
}

interface BriefingResponse {
  text: string;
  stats: BriefingStats;
  generatedAt: string;
}

const DIANA_GREETING =
  "Goedemorgen Jan! Fijn dat je er bent. Alles staat klaar voor vandaag. Kan ik je ergens mee helpen?";

export default function OwnerModePanel({ isOpen, onClose }: OwnerModePanelProps) {
  const { soundEnabled, volume } = useAudioContext();
  const { playOwnerMode } = useAudio(soundEnabled, volume);
  const [greeted, setGreeted] = useState(false);
  const [activeTab, setActiveTab] = useState<"briefing" | "actions" | "brain">("briefing");

  const { data: briefing } = useQuery<BriefingResponse>({
    queryKey: ["/api/elena/briefing"],
    enabled: isOpen,
    refetchInterval: isOpen ? 60_000 : false,
  });

  useEffect(() => {
    if (isOpen && !greeted) {
      playOwnerMode();
      if (window.speechSynthesis) {
        const utterance = new SpeechSynthesisUtterance(DIANA_GREETING);
        utterance.lang = "nl-NL";
        utterance.rate = 0.88;
        utterance.pitch = 1.05;
        utterance.volume = soundEnabled ? 0.9 : 0;
        window.speechSynthesis.speak(utterance);
      }
      setGreeted(true);
    }
    if (!isOpen) setGreeted(false);
  }, [isOpen, greeted, playOwnerMode, soundEnabled]);

  const ownerActions = [
    { label: "Prenotazioni oggi", description: "Vedi e gestisci le prenotazioni di oggi" },
    { label: "Vista settimana", description: "Vista settimanale completa" },
    { label: "Aggiorna menu", description: "Aggiungi o modifica piatti e prezzi" },
    { label: "Orari apertura", description: "Cambia orari di apertura e chiusura" },
    { label: "Gestione tavoli", description: "Aggiungi, rimuovi o riorganizza i tavoli" },
    { label: "Report statistiche", description: "Report settimanale e mensile" },
  ];

  const stats = briefing?.stats;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(10,0,16,0.92)", backdropFilter: "blur(12px)" }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.88, opacity: 0, y: 32 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.88, opacity: 0, y: 32 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="w-full"
            style={{ maxWidth: "480px" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              style={{
                background: "#e4c07f",
                border: "2px solid #0a0010",
                boxShadow: "5px 5px 0 #0a0010",
                borderRadius: "8px 8px 0 0",
                padding: "20px 22px 16px",
                color: "#160926",
              }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div
                    style={{
                      fontSize: "9px",
                      fontFamily: "monospace",
                      letterSpacing: "0.25em",
                      textTransform: "uppercase",
                      opacity: 0.6,
                      marginBottom: "4px",
                    }}
                  >
                    Owner Mode
                  </div>
                  <h2
                    style={{
                      fontSize: "28px",
                      fontWeight: 900,
                      fontFamily: "'Playfair Display', serif",
                      lineHeight: 1,
                    }}
                  >
                    Elena.
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  style={{
                    width: "28px",
                    height: "28px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(22,9,38,0.15)",
                    border: "2px solid rgba(22,9,38,0.2)",
                    borderRadius: "50%",
                    fontSize: "14px",
                    fontWeight: 900,
                    color: "#160926",
                    cursor: "pointer",
                  }}
                >
                  ×
                </button>
              </div>

              {/* Speech bubble */}
              <div
                style={{
                  marginTop: "14px",
                  background: "rgba(22,9,38,0.1)",
                  border: "2px solid rgba(22,9,38,0.15)",
                  borderRadius: "6px",
                  padding: "10px 14px",
                }}
              >
                <p
                  style={{
                    fontSize: "12px",
                    fontStyle: "italic",
                    lineHeight: 1.5,
                    color: "#160926",
                  }}
                >
                  "{DIANA_GREETING}"
                </p>
              </div>

              {/* Live stats row */}
              {stats && (
                <div
                  style={{
                    marginTop: "12px",
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: "8px",
                  }}
                >
                  {[
                    { label: "Prenotaz.", value: stats.reservationsToday },
                    { label: "Coperti", value: stats.totalCovers },
                    { label: "Da conf.", value: stats.pending },
                  ].map(({ label, value }) => (
                    <div
                      key={label}
                      style={{
                        background: "rgba(22,9,38,0.12)",
                        border: "2px solid rgba(22,9,38,0.15)",
                        borderRadius: "5px",
                        padding: "6px 8px",
                        textAlign: "center",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "22px",
                          fontWeight: 900,
                          color: "#160926",
                          lineHeight: 1,
                        }}
                      >
                        {value}
                      </div>
                      <div
                        style={{
                          fontSize: "8px",
                          fontFamily: "monospace",
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          opacity: 0.6,
                          marginTop: "2px",
                        }}
                      >
                        {label}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Tab bar */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                border: "2px solid #0a0010",
                borderTop: "none",
                background: "#160926",
              }}
            >
              {(
                [
                  { id: "briefing", label: "Briefing" },
                  { id: "actions", label: "Azioni" },
                  { id: "brain", label: "Prompt AI" },
                ] as const
              ).map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  style={{
                    padding: "8px 4px",
                    fontSize: "10px",
                    fontFamily: "monospace",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    fontWeight: 700,
                    cursor: "pointer",
                    border: "none",
                    borderBottom: activeTab === id ? "3px solid #e4c07f" : "3px solid transparent",
                    background: "transparent",
                    color: activeTab === id ? "#e4c07f" : "#5a4a6a",
                    transition: "color 0.15s",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div
              style={{
                background: "#160926",
                border: "2px solid #0a0010",
                borderTop: "none",
                boxShadow: "5px 5px 0 #0a0010",
                borderRadius: "0 0 8px 8px",
                maxHeight: "320px",
                overflowY: "auto",
              }}
            >
              {/* BRIEFING TAB */}
              {activeTab === "briefing" && (
                <div style={{ padding: "14px 16px" }}>
                  {stats?.tips && stats.tips.length > 0 && (
                    <div
                      style={{
                        marginBottom: "12px",
                        background: "rgba(228,192,127,0.08)",
                        border: "2px solid rgba(228,192,127,0.2)",
                        borderRadius: "5px",
                        padding: "10px 12px",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "8px",
                          fontFamily: "monospace",
                          letterSpacing: "0.2em",
                          textTransform: "uppercase",
                          color: "#e4c07f",
                          marginBottom: "6px",
                        }}
                      >
                        Consigli di Elena
                      </div>
                      {stats.tips.map((tip, i) => (
                        <p
                          key={i}
                          style={{
                            fontSize: "11px",
                            color: "#c8b888",
                            lineHeight: 1.5,
                            marginBottom: i < stats.tips.length - 1 ? "4px" : 0,
                          }}
                        >
                          — {tip}
                        </p>
                      ))}
                    </div>
                  )}

                  {briefing?.text ? (
                    <pre
                      style={{
                        fontSize: "10px",
                        fontFamily: "monospace",
                        color: "#7a6a8a",
                        whiteSpace: "pre-wrap",
                        lineHeight: 1.7,
                      }}
                    >
                      {briefing.text}
                    </pre>
                  ) : (
                    <p
                      style={{
                        fontSize: "11px",
                        color: "#3a2a4a",
                        fontFamily: "monospace",
                        textAlign: "center",
                        padding: "24px 0",
                      }}
                    >
                      Caricamento briefing...
                    </p>
                  )}
                </div>
              )}

              {/* ACTIONS TAB */}
              {activeTab === "actions" && (
                <div
                  style={{
                    padding: "14px",
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "8px",
                  }}
                >
                  {ownerActions.map(({ label, description }) => (
                    <button
                      key={label}
                      style={{
                        background: "rgba(228,192,127,0.05)",
                        border: "2px solid rgba(228,192,127,0.15)",
                        borderRadius: "6px",
                        padding: "12px",
                        textAlign: "left",
                        cursor: "pointer",
                        transition: "border-color 0.15s",
                        boxShadow: "3px 3px 0 #0a0010",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "12px",
                          fontWeight: 700,
                          color: "#e4c07f",
                          fontFamily: "monospace",
                          marginBottom: "3px",
                        }}
                      >
                        {label}
                      </div>
                      <div style={{ fontSize: "10px", color: "#5a4a6a", lineHeight: 1.4 }}>
                        {description}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* BRAIN TAB */}
              {activeTab === "brain" && (
                <div style={{ padding: "14px 16px" }}>
                  <div
                    style={{
                      marginBottom: "10px",
                      fontSize: "9px",
                      fontFamily: "monospace",
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      color: "#5a4a6a",
                    }}
                  >
                    Prompt attivo — Elena risponde al telefono di Jan
                  </div>
                  <BrainPreview />
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function BrainPreview() {
  const { data, isLoading } = useQuery<{ prompt: string; generatedAt: string }>({
    queryKey: ["/api/elena/brain"],
  });

  if (isLoading) {
    return (
      <p style={{ fontSize: "10px", color: "#3a2a4a", fontFamily: "monospace", textAlign: "center", padding: "16px 0" }}>
        Caricamento prompt...
      </p>
    );
  }

  return (
    <pre
      style={{
        fontSize: "9px",
        fontFamily: "monospace",
        color: "#5a4a6a",
        whiteSpace: "pre-wrap",
        lineHeight: 1.6,
        maxHeight: "240px",
        overflowY: "auto",
      }}
    >
      {data?.prompt ?? "Prompt non disponibile."}
    </pre>
  );
}
