import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAudioContext } from "@/contexts/AudioContext";
import { useAudio } from "@/hooks/use-audio";

interface OwnerModePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const DIANA_GREETING =
  "Che piacere sentirti! Spero che tu sia contento del mio lavoro. Come posso aiutarti oggi?";

export default function OwnerModePanel({ isOpen, onClose }: OwnerModePanelProps) {
  const { soundEnabled, volume } = useAudioContext();
  const { playOwnerMode } = useAudio(soundEnabled, volume);
  const [greeted, setGreeted] = useState(false);

  useEffect(() => {
    if (isOpen && !greeted) {
      // Suono attivazione Owner Mode
      playOwnerMode();

      // Saluto vocale Diana via Web Speech API
      if (window.speechSynthesis) {
        const utterance = new SpeechSynthesisUtterance(DIANA_GREETING);
        utterance.lang = "it-IT";
        utterance.rate = 0.85;
        utterance.pitch = 1.05;
        utterance.volume = soundEnabled ? 0.9 : 0;
        window.speechSynthesis.speak(utterance);
      }
      setGreeted(true);
    }
    if (!isOpen) setGreeted(false);
  }, [isOpen, greeted, playOwnerMode, soundEnabled]);

  const ownerActions = [
    { icon: "📅", label: "Prenotazioni di oggi", description: "Vedi e gestisci le prenotazioni di oggi" },
    { icon: "📆", label: "Prenotazioni della settimana", description: "Vista settimanale completa" },
    { icon: "🍽️", label: "Aggiorna il menu", description: "Aggiungi o modifica piatti e prezzi" },
    { icon: "🕐", label: "Modifica orari", description: "Cambia orari di apertura e chiusura" },
    { icon: "👥", label: "Gestione tavoli", description: "Aggiungi, rimuovi o riorganizza i tavoli" },
    { icon: "📊", label: "Statistiche", description: "Report settimanale e mensile" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 40 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="max-w-lg w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header dorato */}
            <div className="rounded-t-3xl bg-gradient-to-r from-[#d4af37] to-[#aa841e] p-6 text-black">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-xs font-mono uppercase tracking-widest mb-1 opacity-60">
                    Owner Mode Attivo
                  </div>
                  <h2 className="text-3xl font-black font-serif">Diana.</h2>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-black/20 hover:bg-black/30 text-black font-bold"
                >
                  ×
                </button>
              </div>
              <div className="mt-4 bg-black/10 rounded-2xl p-4">
                <p className="text-sm font-medium leading-relaxed italic">
                  "{DIANA_GREETING}"
                </p>
              </div>
            </div>

            {/* Azioni */}
            <div className="rounded-b-3xl bg-[#0f0f0f] border border-[#d4af37]/30 border-t-0 p-4">
              <div className="grid grid-cols-2 gap-3">
                {ownerActions.map(({ icon, label, description }) => (
                  <button
                    key={label}
                    className="bg-white/5 hover:bg-[#d4af37]/10 border border-white/10 hover:border-[#d4af37]/40 rounded-2xl p-4 text-left transition group"
                  >
                    <div className="text-2xl mb-2">{icon}</div>
                    <div className="text-sm font-semibold text-white group-hover:text-[#d4af37] transition">
                      {label}
                    </div>
                    <div className="text-[11px] text-gray-500 mt-0.5">{description}</div>
                  </button>
                ))}
              </div>

              <div className="mt-4 text-center">
                <p className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">
                  Eetcafé Full House · De Veste 1692, Lelystad
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
