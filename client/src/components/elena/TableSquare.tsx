import { useAudioContext } from "@/contexts/AudioContext";
import { useAudio } from "@/hooks/use-audio";

export interface TableData {
  id: number;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  capacity: number;
  status: "free" | "occupied" | "reserved";
  mergedWith: number[];
}

interface TableSquareProps {
  table: TableData;
  selected: boolean;
  onSelect: (id: number) => void;
  onDrop: (id: number, x: number, y: number) => void;
}

const STATUS_COLORS: Record<string, string> = {
  free: "bg-yellow-400 border-black",
  occupied: "bg-red-500 border-black text-white",
  reserved: "bg-blue-500 border-black text-white",
};

const STATUS_LABELS: Record<string, string> = {
  free: "Libero",
  occupied: "Occupato",
  reserved: "Prenotato",
};

export default function TableSquare({ table, selected, onSelect, onDrop }: TableSquareProps) {
  const { soundEnabled, volume } = useAudioContext();
  const { playTableClick } = useAudio(soundEnabled, volume);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("tableId", String(table.id));
    e.dataTransfer.effectAllowed = "move";
  };

  const handleClick = () => {
    playTableClick();
    onSelect(table.id);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onClick={handleClick}
      className={`
        absolute flex flex-col items-center justify-center
        border-4 rounded-xl cursor-grab active:cursor-grabbing
        font-bold text-black shadow-[4px_4px_0px_black]
        select-none transition-transform
        ${STATUS_COLORS[table.status] || STATUS_COLORS.free}
        ${selected ? "ring-4 ring-[#d4af37] ring-offset-2 scale-105" : "hover:scale-105"}
        ${table.mergedWith && table.mergedWith.length > 0 ? "opacity-90" : ""}
      `}
      style={{
        left: `${table.x}%`,
        top: `${table.y}%`,
        width: `${table.width}px`,
        height: `${table.height}px`,
        transform: "translate(-50%, -50%)",
      }}
      title={`${table.label} — ${STATUS_LABELS[table.status]} — ${table.capacity} posti`}
    >
      <span className="text-sm font-black leading-none">{table.label}</span>
      <span className="text-[10px] mt-0.5 opacity-80">{table.capacity}p</span>
      {table.status === "reserved" && (
        <span className="absolute -top-2 -right-2 text-xs bg-[#d4af37] text-black rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
          !
        </span>
      )}
    </div>
  );
}
