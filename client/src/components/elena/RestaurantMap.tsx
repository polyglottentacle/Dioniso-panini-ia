import { useState, useCallback } from "react";
import TableSquare, { type TableData } from "./TableSquare";

interface RestaurantMapProps {
  tables: TableData[];
  onTableUpdate: (id: number, x: number, y: number) => void;
  onMergeTables: (ids: number[]) => void;
  onUnmergeTable: (id: number) => void;
  onStatusCycle: (id: number, status: TableData["status"]) => void;
}

function BarCounter() {
  return (
    <div
      style={{
        position: "absolute",
        top: "2%",
        left: "50%",
        transform: "translateX(-50%)",
        width: "46%",
        height: "10%",
        background: "#2a1a0e",
        border: "2px solid #0a0010",
        boxShadow: "4px 4px 0 #0a0010",
        borderRadius: "3px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "6px",
        zIndex: 2,
        pointerEvents: "none",
      }}
    >
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          style={{
            width: "7px",
            height: "18px",
            background: "#3e2210",
            border: "1px solid #0a0010",
            borderRadius: "2px",
          }}
        />
      ))}
      <span
        style={{
          position: "absolute",
          bottom: "3px",
          fontFamily: "monospace",
          fontSize: "8px",
          fontWeight: 700,
          color: "#e4c07f",
          letterSpacing: "0.25em",
          textTransform: "uppercase",
        }}
      >
        BAR
      </span>
    </div>
  );
}

function Plant({
  top,
  left,
  right,
  bottom,
}: {
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
}) {
  return (
    <div
      style={{
        position: "absolute",
        top,
        left,
        right,
        bottom,
        width: "26px",
        height: "26px",
        background: "#0c230c",
        border: "2px solid #0a0010",
        boxShadow: "3px 3px 0 #0a0010",
        borderRadius: "50%",
        zIndex: 2,
        pointerEvents: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "10px",
          height: "13px",
          background: "#276027",
          borderRadius: "50% 50% 40% 40%",
          border: "1px solid #0a0010",
        }}
      />
    </div>
  );
}

function EntryDoor() {
  return (
    <div
      style={{
        position: "absolute",
        bottom: "0",
        left: "50%",
        transform: "translateX(-50%)",
        width: "11%",
        height: "5.5%",
        background: "#1a0e06",
        border: "2px solid #e4c07f",
        borderBottom: "none",
        borderRadius: "3px 3px 0 0",
        zIndex: 2,
        pointerEvents: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <span
        style={{
          fontFamily: "monospace",
          fontSize: "7px",
          fontWeight: 700,
          color: "#e4c07f",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
        }}
      >
        IN
      </span>
    </div>
  );
}

function DianaAvatar() {
  return (
    <div
      style={{
        position: "absolute",
        bottom: "8px",
        right: "8px",
        zIndex: 20,
        pointerEvents: "none",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "2px",
      }}
    >
      <svg
        width="34"
        height="34"
        viewBox="0 0 34 34"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="17" cy="17" r="15" fill="#e4c07f" stroke="#0a0010" strokeWidth="2" />
        <ellipse cx="17" cy="11" rx="9" ry="6" fill="#7a550e" />
        <circle cx="17" cy="20" r="9" fill="#f5d89a" />
        <circle cx="13.5" cy="19" r="1.5" fill="#160926" />
        <circle cx="20.5" cy="19" r="1.5" fill="#160926" />
        <path
          d="M13 23 Q17 26.5 21 23"
          stroke="#160926"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />
        <circle cx="10" cy="9" r="1.5" fill="#e4c07f" stroke="#0a0010" strokeWidth="1" />
        <circle cx="17" cy="6" r="1.5" fill="#e4c07f" stroke="#0a0010" strokeWidth="1" />
        <circle cx="24" cy="9" r="1.5" fill="#e4c07f" stroke="#0a0010" strokeWidth="1" />
      </svg>
      <span
        style={{
          fontFamily: "monospace",
          fontSize: "7px",
          color: "#e4c07f",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
        }}
      >
        DIANA
      </span>
    </div>
  );
}

export default function RestaurantMap({
  tables,
  onTableUpdate,
  onMergeTables,
  onUnmergeTable,
  onStatusCycle,
}: RestaurantMapProps) {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const handleSelect = useCallback((id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }, []);

  const handleMerge = () => {
    if (selectedIds.length < 2) return;
    onMergeTables(selectedIds);
    setSelectedIds([]);
  };

  const handleClearSelection = () => setSelectedIds([]);

  // "Dividi" appears when exactly one merged table is selected
  const selectedMergedTable =
    selectedIds.length === 1
      ? tables.find((t) => t.id === selectedIds[0] && t.mergedWith?.length > 0)
      : undefined;

  const handleUnmerge = () => {
    if (!selectedMergedTable) return;
    onUnmergeTable(selectedMergedTable.id);
    setSelectedIds([]);
  };

  return (
    <div className="flex flex-col h-full gap-3">
      {/* Toolbar */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex gap-4">
          {[
            { bg: "#e4c07f", label: "Libero" },
            { bg: "#c0392b", label: "Occupato" },
            { bg: "#2471a3", label: "Prenotato" },
          ].map(({ bg, label }) => (
            <span key={label} className="flex items-center gap-1.5">
              <span
                style={{
                  display: "inline-block",
                  width: "11px",
                  height: "11px",
                  background: bg,
                  border: "2px solid #0a0010",
                  boxShadow: "2px 2px 0 #0a0010",
                  borderRadius: "2px",
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontSize: "10px",
                  fontFamily: "monospace",
                  color: "#7a6a8a",
                  letterSpacing: "0.05em",
                }}
              >
                {label}
              </span>
            </span>
          ))}
        </div>

        <div className="flex gap-2">
          {selectedIds.length > 0 && (
            <>
              <button
                onClick={handleClearSelection}
                style={{
                  fontSize: "10px",
                  padding: "3px 10px",
                  border: "2px solid #e4c07f",
                  color: "#e4c07f",
                  background: "transparent",
                  borderRadius: "3px",
                  boxShadow: "2px 2px 0 #0a0010",
                  fontFamily: "monospace",
                  cursor: "pointer",
                  letterSpacing: "0.05em",
                }}
              >
                × {selectedIds.length}
              </button>
              {selectedIds.length >= 2 && (
                <button
                  onClick={handleMerge}
                  style={{
                    fontSize: "10px",
                    padding: "3px 10px",
                    background: "#e4c07f",
                    color: "#160926",
                    border: "2px solid #0a0010",
                    borderRadius: "3px",
                    boxShadow: "3px 3px 0 #0a0010",
                    fontFamily: "monospace",
                    fontWeight: 700,
                    cursor: "pointer",
                    letterSpacing: "0.05em",
                  }}
                >
                  Unisci →
                </button>
              )}
              {selectedMergedTable && (
                <button
                  onClick={handleUnmerge}
                  style={{
                    fontSize: "10px",
                    padding: "3px 10px",
                    background: "#160926",
                    color: "#e4c07f",
                    border: "2px solid #e4c07f",
                    borderRadius: "3px",
                    boxShadow: "3px 3px 0 #0a0010",
                    fontFamily: "monospace",
                    fontWeight: 700,
                    cursor: "pointer",
                    letterSpacing: "0.05em",
                  }}
                >
                  ÷ Dividi
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Map Canvas */}
      <div
        className="relative flex-1 overflow-hidden"
        style={{
          background: "#160926",
          border: "2px solid #e4c07f",
          boxShadow: "4px 4px 0 #0a0010",
          borderRadius: "6px",
          minHeight: "320px",
        }}
      >
        {/* Floor dot texture */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(228,192,127,0.07) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
            zIndex: 0,
          }}
        />

        {/* Room furniture */}
        <BarCounter />
        <EntryDoor />
        <Plant top="4%" left="2%" />
        <Plant top="4%" right="2%" />
        <Plant bottom="9%" left="2%" />
        <Plant bottom="9%" right="2%" />

        {/* Wall separator below bar */}
        <div
          style={{
            position: "absolute",
            top: "15%",
            left: "4%",
            right: "4%",
            height: "1px",
            background: "rgba(228,192,127,0.1)",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />

        {tables.length === 0 && (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ zIndex: 10 }}
          >
            <p
              style={{
                fontSize: "10px",
                textTransform: "uppercase",
                letterSpacing: "0.25em",
                color: "#e4c07f",
                opacity: 0.35,
                fontFamily: "monospace",
              }}
            >
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
            onStatusCycle={onStatusCycle}
          />
        ))}

        <DianaAvatar />
      </div>

      <p
        style={{
          fontSize: "9px",
          textAlign: "center",
          color: "#3a2a4a",
          fontFamily: "monospace",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
        }}
      >
        Tocca = seleziona · Trascina = sposta · Doppio tocco = stato · 2+ per unire
      </p>
    </div>
  );
}
