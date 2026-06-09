import { useState, useEffect } from "react";
import QRCode from "qrcode";
import { Link } from "wouter";

const INK = "#0a0a0a";
const ORANGE = "#e87722";
const CREAM = "#f5f0e8";

export default function QrPosterPage() {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [qrError, setQrError] = useState(false);
  const prenota = `${window.location.origin}/prenota`;

  useEffect(() => {
    QRCode.toDataURL(prenota, {
      width: 640,
      margin: 1,
      errorCorrectionLevel: "M",
      color: { dark: INK, light: CREAM },
    })
      .then(setDataUrl)
      .catch(() => setQrError(true));
  }, [prenota]);

  return (
    <>
      {/* Scoped print CSS */}
      <style>{`
        @media print {
          @page { size: A4 portrait; margin: 10mm; }
          body * { visibility: hidden; }
          #qr-poster, #qr-poster * { visibility: visible; }
          #qr-poster { position: absolute; left: 0; top: 0; width: 100%; box-shadow: none !important; }
          .no-print { display: none !important; }
        }
      `}</style>

      {/* Toolbar */}
      <div
        className="no-print"
        style={{ background: INK, borderBottom: `2px solid ${ORANGE}`, padding: "12px 20px", display: "flex", alignItems: "center", gap: "16px" }}
      >
        <Link href="/prenota" style={{ fontFamily: "monospace", fontSize: "11px", color: ORANGE, textDecoration: "none", letterSpacing: "0.1em" }}>
          ← /prenota
        </Link>
        <button
          onClick={() => window.print()}
          style={{ fontFamily: "monospace", fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", background: ORANGE, border: `2px solid ${INK}`, boxShadow: `3px 3px 0 ${INK}`, borderRadius: "3px", padding: "6px 16px", color: INK, fontWeight: 700, cursor: "pointer" }}
        >
          Print poster
        </button>
        <span style={{ fontFamily: "monospace", fontSize: "9px", color: "#6a5a4a", letterSpacing: "0.1em" }}>
          Hang op aan de ingang of bij de kassa
        </span>
      </div>

      {/* A4 sheet */}
      <div style={{ background: "#1a1a1a", minHeight: "calc(100vh - 60px)", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "32px 20px" }}>
        <div
          id="qr-poster"
          style={{
            background: CREAM,
            color: INK,
            width: "100%",
            maxWidth: "595px", // ~A4 at 72dpi
            aspectRatio: "1 / 1.414",
            padding: "40px",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 8px 40px rgba(0,0,0,0.5)",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          {/* Brand block */}
          <div style={{ textAlign: "center", width: "100%" }}>
            <div style={{ fontFamily: "monospace", fontSize: "11px", letterSpacing: "0.35em", textTransform: "uppercase", color: ORANGE, marginBottom: "6px" }}>
              Eetcafé
            </div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: "52px", color: INK, lineHeight: 1 }}>
              Full House
            </div>
            {/* Dutch flag strip */}
            <div style={{ display: "flex", justifyContent: "center", gap: "0", marginTop: "12px" }}>
              {["#AE1C28", "#FFFFFF", "#21468B"].map((c, i) => (
                <div key={i} style={{ width: "40px", height: "10px", background: c, border: `1px solid ${INK}` }} />
              ))}
            </div>
          </div>

          {/* Headline */}
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "28px", color: INK, lineHeight: 1.2 }}>
              Scan &amp; reserveer
            </div>
            <div style={{ fontFamily: "monospace", fontSize: "12px", color: "#5a4a3a", marginTop: "8px", letterSpacing: "0.04em" }}>
              Reserveer uw tafel in 30 seconden — Elena helpt u direct.
            </div>
          </div>

          {/* QR code */}
          <div style={{ textAlign: "center" }}>
            {qrError ? (
              <div style={{ width: "200px", height: "200px", border: `3px solid ${INK}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "monospace", fontSize: "11px" }}>
                QR niet beschikbaar
              </div>
            ) : dataUrl ? (
              <img
                src={dataUrl}
                alt="QR code naar /prenota"
                style={{ width: "200px", height: "200px", border: `3px solid ${INK}`, boxShadow: `5px 5px 0 ${INK}`, display: "block" }}
              />
            ) : (
              <div style={{ width: "200px", height: "200px", border: `3px solid rgba(10,10,10,0.2)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontFamily: "monospace", fontSize: "10px", color: "#8a7a6a" }}>Laden...</span>
              </div>
            )}
            <div style={{ fontFamily: "monospace", fontSize: "9px", color: "#8a7a6a", marginTop: "8px", letterSpacing: "0.1em", wordBreak: "break-all" }}>
              {prenota}
            </div>
          </div>

          {/* Footer info */}
          <div style={{ textAlign: "center", borderTop: `2px solid rgba(10,10,10,0.15)`, paddingTop: "16px", width: "100%" }}>
            <div style={{ fontFamily: "monospace", fontSize: "11px", color: "#5a4a3a", letterSpacing: "0.08em", lineHeight: 1.8 }}>
              <strong>Di–zo 11:00–22:00</strong> · Maandag gesloten
            </div>
            <div style={{ fontFamily: "monospace", fontSize: "11px", color: "#5a4a3a", letterSpacing: "0.06em" }}>
              De Veste 1692, Lelystad · +31 320 282 428
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
