import { useState, useCallback } from "react";
import TableSquare, { type TableData } from "./TableSquare";
import { useAudioContext } from "@/contexts/AudioContext";
import { useAudio } from "@/hooks/use-audio";

interface RestaurantMapProps {
  tables: TableData[];
  onTableUpdate: (id: number, x: number, y: number) => void;
  onMergeTables: (ids: number[]) => void;
}

export default function RestaurantMap({ tables, onTableUpdate, onMergeTables }: RestaurantMapProps) {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const { soundEnabled, volume } = useAudioContext();
  const { playTableClick } = useAudio(soundEnabled, volume);

  const handleSelect = useCallback((id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const id = parseInt(e.dataTransfer.getData("tableId"));
    if (!id) return;

    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const xPct = ((e.clientX - rect.left) / rect.width) * 100;
    const yPct = ((e.clientY - rect.top) / rect.height) * 100;

    // Clamp within map bounds (5–95%)
    const x = Math.min(95, Math.max(5, xPct));
    const y = Math.min(95, Math.max(5, yPct));

    playTableClick();
    onTableUpdate(id, x, y);
  }, [onTableUpdate, playTableClick]);

  const handleMerge = () => {
    if (selectedIds.length < 2) return;
    onMergeTables(selectedIds);
    setSelectedIds([]);
  };

  const handleClearSelection = () => setSelectedIds([]);

  const legend = [
    { color: "bg-yellow-400", label: "Libero" },
    { color: "bg-red-500", label: "Occupato" },
    { color: "bg-blue-500 animate-pulse", label: "Prenotato" },
  ];

  return (
    <div className="flex flex-col h-full gap-3">
      {/* Legenda + azioni */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex gap-4">
          {legend.map(({ color, label }) => (
            <span key={label} className="flex items-center gap-1.5 text-xs font-mono">
              <span className={`w-3 h-3 rounded-sm border border-black ${color}`} />
              {label}
            </span>
          ))}
        </div>

        <div className="flex gap-2">
          {selectedIds.length > 0 && (
            <>
              <button
                onClick={handleClearSelection}
                className="text-xs px-3 py-1 border border-gray-400 rounded-full hover:bg-gray-100"
              >
                Deseleziona ({selectedIds.length})
              </button>
              {selectedIds.length >= 2 && (
                <button
                  onClick={handleMerge}
                  className="text-xs px-3 py-1 bg-[#d4af37] text-black font-bold rounded-full hover:opacity-90 shadow"
                >
                  Unisci tavoli →
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Mappa */}
      <div
        className="relative flex-1 rounded-3xl overflow-hidden border-2 border-[#d4af37]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(212,175,55,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.1) 1px, transparent 1px)",
          backgroundSize: "30px 30px",
          backgroundColor: "#0a0a0a",
          minHeight: "320px",
        }}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {tables.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-[10px] uppercase tracking-widest text-[#d4af37] opacity-40 font-mono">
              Nessun tavolo configurato
            </p>
          </div>
        )}

        {tables.map((table) => (
          <TableSquare
            key={table.id}
            table={table}
            selected={selectedIds.includes(table.id)}
            onSelect={handleSelect}
            onDrop={onTableUpdate}
          />
        ))}
      </div>

      <p className="text-[10px] text-gray-500 font-mono text-center">
        Clicca per selezionare • Trascina per spostare • Seleziona 2+ per unire
      </p>
    </div>
  );
}
