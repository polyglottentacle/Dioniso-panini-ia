import { useRef, useState } from "react";
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

// Drop bounds (% of map): keep tables off the bar (top) and door (bottom)
export const MAP_BOUNDS = { xMin: 8, xMax: 92, yMin: 18, yMax: 87 };

interface TableSquareProps {
  table: TableData;
  selected: boolean;
  locked: boolean; // layout lock: tap/status still work, dragging is disabled
  onSelect: (id: number) => void;
  onDrop: (id: number, x: number, y: number) => void;
  onStatusCycle: (id: number, status: TableData["status"]) => void;
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

const NEXT_STATUS: Record<TableData["status"], TableData["status"]> = {
  free: "occupied",
  occupied: "reserved",
  reserved: "free",
};

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

export default function TableSquare({
  table,
  selected,
  locked,
  onSelect,
  onDrop,
  onStatusCycle,
}: TableSquareProps) {
  const { soundEnabled, volume } = useAudioContext();
  const { playTableClick } = useAudio(soundEnabled, volume);

  const elRef = useRef<HTMLDivElement>(null);
  // Pointer-drag state: works with mouse AND touch (iPad)
  const dragRef = useRef<{ startX: number; startY: number; moved: boolean; pos: { x: number; y: number } | null } | null>(null);
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null);

  const s = STATUS_STYLES[table.status] ?? STATUS_STYLES.free;
  const isMerged = table.mergedWith && table.mergedWith.length > 0;

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    elRef.current?.setPointerCapture(e.pointerId);
    dragRef.current = { startX: e.clientX, startY: e.clientY, moved: false, pos: null };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d) return;
    if (locked) return; // layout locked: no dragging during service
    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;
    if (!d.moved && Math.hypot(dx, dy) < 6) return; // tap vs drag threshold
    d.moved = true;

    const parent = elRef.current?.parentElement;
    if (!parent) return;
    const rect = parent.getBoundingClientRect();
    const xPct = clamp(((e.clientX - rect.left) / rect.width) * 100, MAP_BOUNDS.xMin, MAP_BOUNDS.xMax);
    const yPct = clamp(((e.clientY - rect.top) / rect.height) * 100, MAP_BOUNDS.yMin, MAP_BOUNDS.yMax);
    d.pos = { x: xPct, y: yPct };
    setDragPos(d.pos);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    const d = dragRef.current;
    dragRef.current = null;
    elRef.current?.releasePointerCapture?.(e.pointerId);

    if (d?.moved && d.pos) {
      playTableClick();
      onDrop(table.id, Math.round(d.pos.x * 10) / 10, Math.round(d.pos.y * 10) / 10);
      setDragPos(null);
    } else if (d) {
      // It was a tap/click → toggle selection
      playTableClick();
      onSelect(table.id);
    }
  };

  const handleDoubleClick = () => {
    onStatusCycle(table.id, NEXT_STATUS[table.status] ?? "free");
  };

  const x = dragPos?.x ?? table.x;
  const y = dragPos?.y ?? table.y;
  const isDragging = dragPos !== null;

  return (
    <div
      ref={elRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={() => { dragRef.current = null; setDragPos(null); }}
      onDoubleClick={handleDoubleClick}
      title={`${table.label} — ${STATUS_LABELS[table.status]} — ${table.capacity} posti — doppio click cambia stato`}
      style={{
        position: "absolute",
        left: `${x}%`,
        top: `${y}%`,
        width: `${table.width}px`,
        height: `${table.height}px`,
        transform: "translate(-50%, -50%)",
        background: s.bg,
        border: `2px solid #0a0010`,
        boxShadow: selected
          ? `0 0 0 3px #e4c07f, 4px 4px 0 #0a0010`
          : isDragging
            ? `6px 6px 0 #0a0010`
            : `4px 4px 0 #0a0010`,
        borderRadius: "4px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        cursor: isDragging ? "grabbing" : locked ? "pointer" : "grab",
        userSelect: "none",
        touchAction: "none", // critical: lets pointer-drag work on touch without scrolling
        zIndex: isDragging ? 30 : selected ? 15 : 5,
        opacity: isMerged ? 0.95 : 1,
        outline:
          table.status === "reserved"
            ? "2px dashed rgba(255,255,255,0.35)"
            : "none",
        outlineOffset: "-5px",
        transition: isDragging ? "none" : "left 0.15s, top 0.15s",
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

      {/* Merged chain badge */}
      {isMerged && (
        <span
          style={{
            position: "absolute",
            top: "-7px",
            left: "-7px",
            minWidth: "15px",
            height: "15px",
            padding: "0 3px",
            background: "#160926",
            border: "2px solid #e4c07f",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "8px",
            fontWeight: 900,
            fontFamily: "monospace",
            color: "#e4c07f",
            boxShadow: "2px 2px 0 #0a0010",
          }}
        >
          +{table.mergedWith.length}
        </span>
      )}

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
