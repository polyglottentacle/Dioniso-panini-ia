import { motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { useAudioContext } from "@/contexts/AudioContext";

export default function AudioToggle() {
  const { soundEnabled, toggleSound } = useAudioContext();

  return (
    <motion.button
      onClick={toggleSound}
      className="fixed bottom-16 right-4 z-50 bg-fisher-blue text-white rounded-full p-2 shadow-lg"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      aria-label={soundEnabled ? "Disattiva suoni" : "Attiva suoni"}
      title={soundEnabled ? "Disattiva suoni" : "Attiva suoni"}
    >
      {soundEnabled ? (
        <Volume2 className="h-6 w-6" />
      ) : (
        <VolumeX className="h-6 w-6" />
      )}
    </motion.button>
  );
}
