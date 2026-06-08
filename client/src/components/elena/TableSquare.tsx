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

const STATUS_STYLES: Record<
  string,
  { bg: string; text: string; accent: string }
> = {
  free: { bg: "#e4c07f", text: "#160926", accent: "#c9a84c" },
  occupied: { bg: "#c0392b", text: "#ffffff", accent: "#962d21" },
  reserved: { bg: "#2471a3", text: "#ffffff", accent: "#1a5580" },
};

const STATUS_LABELS: Record<string, string> = {
  free: "Libero",
  occupied: "Occupato",
  reserved: "Prenotato",
};

export default function TableSquare({
  table,
  selected,
  onSelect,
}: TableSquareProps) {
  const { soundEnabled, volume } = useAudioContext();
  const { playTableClick } = useAudio(soundEnabled, volume);

  const s = STATUS_STYLES[table.status] ?? STATUS_STYLES.free;
  const isMerged = table.mergedWith && table.mergedWith.length > 0;

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
      title={`${table.label} — ${STATUS_LABELS[table.status]} — ${table.capacity} posti`}
      className="active:cursor-grabbing"
      style={{
        position: "absolute",
        left: `${table.x}%`,
        top: `${table.y}%`,
        width: `${table.width}px`,
        height: `${table.height}px`,
        transform: "translate(-50%, -50%)",
        background: s.bg,
        border: `2px solid #0a0010`,
        boxShadow: selected
          ? `0 0 0 3px #e4c07f, 4px 4px 0 #0a0010`
          : `4px 4px 0 #0a0010`,
        borderRadius: "4px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        cursor: "grab",
        userSelect: "none",
        zIndex: selected ? 15 : 5,
        opacity: isMerged ? 0.85 : 1,
        outline:
          table.status === "reserved"
            ? "2px dashed rgba(255,255,255,0.35)"
            : "none",
        outlineOffset: "-5px",
      }}
    >
      {/* Bottom accent strip */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "5px",
          background: s.accent,
          borderRadius: "0 0 2px 2px",
        }}
      />

      <span
        style={{
          fontSize: "12px",
          fontWeight: 900,
          fontFamily: "monospace",
          color: s.text,
          letterSpacing: "0.04em",
          lineHeight: 1,
        }}
      >
        {table.label}
      </span>
      <span
        style={{
          fontSize: "9px",
          fontFamily: "monospace",
          color: s.text,
          opacity: 0.7,
          marginTop: "3px",
        }}
      >
        {table.capacity}p
      </span>

      {table.status === "reserved" && (
        <div
          style={{
            position: "absolute",
            top: "-7px",
            right: "-7px",
            width: "15px",
            height: "15px",
            background: "#e4c07f",
            border: "2px solid #0a0010",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "8px",
            fontWeight: 900,
            color: "#160926",
            boxShadow: "2px 2px 0 #0a0010",
          }}
        >
          !
        </div>
      )}
    </div>
  );
}
