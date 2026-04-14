import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AudioContextType {
  soundEnabled: boolean;
  volume: number;
  toggleSound: () => void;
  setVolume: (v: number) => void;
}

const AudioCtx = createContext<AudioContextType>({
  soundEnabled: true,
  volume: 0.7,
  toggleSound: () => {},
  setVolume: () => {},
});

export function AudioProvider({ children }: { children: ReactNode }) {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [volume, setVolumeState] = useState(0.7);

  useEffect(() => {
    const saved = localStorage.getItem("audioPreferences");
    if (saved) {
      try {
        const { soundEnabled: se, volume: v } = JSON.parse(saved);
        setSoundEnabled(se ?? true);
        setVolumeState(v ?? 0.7);
      } catch {}
    }
  }, []);

  const toggleSound = () => {
    setSoundEnabled((prev) => {
      const next = !prev;
      localStorage.setItem(
        "audioPreferences",
        JSON.stringify({ soundEnabled: next, volume })
      );
      return next;
    });
  };

  const setVolume = (v: number) => {
    setVolumeState(v);
    localStorage.setItem(
      "audioPreferences",
      JSON.stringify({ soundEnabled, volume: v })
    );
  };

  return (
    <AudioCtx.Provider value={{ soundEnabled, volume, toggleSound, setVolume }}>
      {children}
    </AudioCtx.Provider>
  );
}

export function useAudioContext() {
  return useContext(AudioCtx);
}
