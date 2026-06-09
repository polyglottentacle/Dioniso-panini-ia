import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { useWebSocket, type WSMessage } from "@/hooks/use-websocket";
import type { Reservation } from "@shared/schema";

const INK = "#0a0a0a";
const ORANGE = "#e87722";
const CREAM = "#f5f0e8";

const NL_WEEKDAYS = ["zondag", "maandag", "dinsdag", "woensdag", "donderdag", "vrijdag", "zaterdag"];
const NL_MONTHS = ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"];

function todayNL(): string {
  const d = new Date();
  return `${NL_WEEKDAYS[d.getDay()]} ${d.getDate()} ${NL_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

function StatusBadge({ status }: { status: string }) {
  if (status === "cancelled") return <span style={{ fontFamily: "monospace", fontSize: "9px", letterSpacing: "0.1em", textDecoration: "line-through", color: "#9a8a7a" }}>GEANNULEERD</span>;
  if (status === "pending") return <span style={{ fontFamily: "monospace", fontSize: "9px", color: "#c45e10", border: `1px solid #c45e10`, borderRadius: 2, padding: "1px 5px" }}>□ te bevestigen</span>;
  if (status === "confirmed") return <span style={{ fontFamily: "monospace", fontSize: "9px", color: "#2e7d32", border: `1px solid #2e7d32`, borderRadius: 2, padding: "1px 5px" }}>✓ bevestigd</span>;
  return null;
}

export default function DagstaatPage() {
  const queryClient = useQueryClient();

  const { data: reservations = [] } = useQuery<Reservation[]>({
    queryKey: ["/api/reservations/today"],
  });

  // Live updates via WebSocket
  useWebSocket({
    role: "admin",
    onMessage: (msg: WSMessage) => {
      if (msg.type === "new_reservation" || msg.type === "reservation_updated") {
        queryClient.invalidateQueries({ queryKey: ["/api/reservations/today"] });
      }
    },
  });

  const active = reservations.filter((r) => r.status !== "cancelled");
  const totalCovers = active.reduce((s, r) => s + (r.partySize ?? 0), 0);
  const sorted = [...reservations].sort((a, b) => (a.time ?? "").localeCompare(b.time ?? ""));

  return (
    <>
      {/* Scoped print CSS */}
      <style>{`
        @media print {
          @page { size: A4 portrait; margin: 12mm; }
          body * { visibility: hidden; }
          #dagstaat-sheet, #dagstaat-sheet * { visibility: visible; }
          #dagstaat-sheet { position: absolute; left: 0; top: 0; width: 100%; background: white !important; }
          .no-print { display: none !important; }
        }
      `}</style>

      {/* Toolbar */}
      <div className="no-print" style={{ background: INK, borderBottom: `2px solid ${ORANGE}`, padding: "12px 20px", display: "flex", alignItems: "center", gap: "16px" }}>
        <Link href="/elena" style={{ fontFamily: "monospace", fontSize: "11px", color: ORANGE, textDecoration: "none", letterSpacing: "0.1em" }}>
          ← Terug
        </Link>
        <button
          onClick={() => window.print()}
          style={{ fontFamily: "monospace", fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", background: ORANGE, border: `2px solid ${INK}`, boxShadow: `3px 3px 0 ${INK}`, borderRadius: "3px", padding: "6px 16px", color: INK, fontWeight: 700, cursor: "pointer" }}
        >
          Print dagstaat
        </button>
        <span style={{ fontFamily: "monospace", fontSize: "9px", color: ORANGE, letterSpacing: "0.1em" }}>
          ● live
        </span>
      </div>

      {/* Paper sheet */}
      <div style={{ background: "#1a1a1a", minHeight: "calc(100vh - 60px)", padding: "32px 20px", display: "flex", justifyContent: "center" }}>
        <div
          id="dagstaat-sheet"
          style={{
            background: CREAM,
            color: INK,
            width: "100%",
            maxWidth: "700px",
            padding: "32px 40px",
            boxSizing: "border-box",
            boxShadow: "0 8px 40px rgba(0,0,0,0.5)",
            fontFamily: "'Playfair Display', serif",
          }}
        >
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <div style={{ fontFamily: "monospace", fontSize: "9px", letterSpacing: "0.35em", textTransform: "uppercase", color: ORANGE }}>
              Eetcafé
            </div>
            <div style={{ fontSize: "36px", fontWeight: 900, lineHeight: 1 }}>
              DAGSTAAT
            </div>
            <div style={{ fontFamily: "monospace", fontSize: "11px", letterSpacing: "0.12em", marginTop: "6px", color: "#5a4a3a" }}>
              {todayNL()}
            </div>
            <div style={{ borderBottom: "3px double " + INK, marginTop: "14px" }} />
          </div>

          {/* Column headers */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "60px 1fr 50px 110px 60px 1fr",
              gap: "0 8px",
              fontFamily: "monospace",
              fontSize: "9px",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#7a6a5a",
              borderBottom: `2px solid ${INK}`,
              paddingBottom: "6px",
              marginBottom: "0",
            }}
          >
            <span>Tijd</span>
            <span>Naam</span>
            <span style={{ textAlign: "center" }}>Pers.</span>
            <span>Telefoon</span>
            <span>Tafel</span>
            <span>Status / Opm.</span>
          </div>

          {/* Rows on ruled lines */}
          <div
            style={{
              backgroundImage: `repeating-linear-gradient(transparent 0px 31px, rgba(10,10,10,0.1) 31px 32px)`,
              borderLeft: `3px solid ${ORANGE}`,
              paddingLeft: "8px",
              minHeight: "320px",
            }}
          >
            {sorted.length === 0 ? (
              <div style={{ fontStyle: "italic", fontSize: "14px", color: "#8a7a6a", paddingTop: "32px", textAlign: "center" }}>
                Nog geen reserveringen voor vandaag.
              </div>
            ) : (
              sorted.map((r) => (
                <div
                  key={r.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "60px 1fr 50px 110px 60px 1fr",
                    gap: "0 8px",
                    height: "32px",
                    alignItems: "center",
                    opacity: r.status === "cancelled" ? 0.5 : 1,
                    textDecoration: r.status === "cancelled" ? "line-through" : "none",
                  }}
                >
                  <span style={{ fontFamily: "monospace", fontWeight: 700, fontSize: "16px", color: INK }}>
                    {r.time ?? "–"}
                  </span>
                  <span style={{ fontWeight: 700, fontSize: "15px", color: INK, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {r.guestName}
                  </span>
                  <span style={{ fontFamily: "monospace", fontWeight: 900, fontSize: "16px", textAlign: "center", color: ORANGE }}>
                    {r.partySize}
                  </span>
                  <span style={{ fontFamily: "monospace", fontSize: "11px", color: "#5a4a3a" }}>
                    {r.guestPhone ?? "–"}
                  </span>
                  <span style={{ fontFamily: "monospace", fontSize: "11px", color: "#7a6a5a" }}>
                    {r.tableId ?? "–"}
                  </span>
                  <div>
                    <StatusBadge status={r.status ?? "pending"} />
                    {r.notes && r.status !== "cancelled" && (
                      <span style={{ fontFamily: "monospace", fontSize: "9px", color: "#7a6a5a", marginLeft: "6px" }}>
                        {r.notes}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Totals */}
          <div
            style={{
              borderTop: `2px solid ${INK}`,
              marginTop: "16px",
              paddingTop: "12px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
            }}
          >
            <div style={{ fontFamily: "monospace", fontWeight: 700, fontSize: "13px", letterSpacing: "0.08em" }}>
              Totaal: {active.length} reservering{active.length !== 1 ? "en" : ""} · {totalCovers} couperts
            </div>
            <div style={{ fontFamily: "monospace", fontSize: "11px", color: "#7a6a5a", textAlign: "right" }}>
              Paraaf Jan: ___________________
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
