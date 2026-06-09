import { useState, useEffect } from "react";
import type { MenuItem, Review } from "@shared/menu-data";

// ── tokens (shared with BookingPage) ───────────────────────────────────────────
const INK = "#0a0a0a";
const ORANGE = "#e87722";
const CREAM = "#f5f0e8";
const MUTED = "#8a8070";

// ── Media tile: video loop, photo, or graceful placeholder ─────────────────────
function MediaTile({ item }: { item: MenuItem }) {
  const ratio = "56.25%"; // 16:9

  if (item.videoUrl) {
    return (
      <div style={{ position: "relative", width: "100%", paddingTop: ratio, background: "#000" }}>
        <video
          src={item.videoUrl}
          poster={item.photoUrl}
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        <span style={tikLabel}>● LIVE</span>
      </div>
    );
  }

  if (item.photoUrl) {
    return (
      <div style={{ position: "relative", width: "100%", paddingTop: ratio }}>
        <img
          src={item.photoUrl}
          alt={item.name}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
    );
  }

  // Placeholder — intentional, not broken-looking
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        paddingTop: ratio,
        background:
          "repeating-linear-gradient(135deg, #141414 0 12px, #0f0f0f 12px 24px)",
        borderBottom: `2px solid rgba(232,119,34,0.2)`,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "6px",
        }}
      >
        <div
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "50%",
            background: ORANGE,
            border: `2px solid ${INK}`,
            boxShadow: `3px 3px 0 ${INK}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'Playfair Display', serif",
            fontWeight: 900,
            fontSize: "20px",
            color: INK,
          }}
        >
          {item.name.charAt(0)}
        </div>
        <span
          style={{
            fontFamily: "monospace",
            fontSize: "8px",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: MUTED,
          }}
        >
          Video binnenkort
        </span>
      </div>
    </div>
  );
}

const tikLabel: React.CSSProperties = {
  position: "absolute",
  top: "8px",
  left: "8px",
  fontFamily: "monospace",
  fontSize: "8px",
  fontWeight: 700,
  letterSpacing: "0.15em",
  color: "#fff",
  background: "rgba(232,119,34,0.9)",
  padding: "2px 6px",
  borderRadius: "2px",
};

// ── Allergen chip ──────────────────────────────────────────────────────────────
function AllergenChip({ label }: { label: string }) {
  return (
    <span
      style={{
        fontFamily: "monospace",
        fontSize: "8px",
        letterSpacing: "0.05em",
        color: MUTED,
        border: `1px solid rgba(232,119,34,0.25)`,
        borderRadius: "2px",
        padding: "1px 5px",
        textTransform: "uppercase",
      }}
    >
      {label}
    </span>
  );
}

// ── Review box ─────────────────────────────────────────────────────────────────
function ReviewBox({ review }: { review: Review }) {
  return (
    <div
      style={{
        flex: 1,
        minWidth: 0,
        background: "rgba(232,119,34,0.05)",
        border: `1px solid rgba(232,119,34,0.18)`,
        borderRadius: "3px",
        padding: "6px 8px",
      }}
    >
      <div style={{ color: ORANGE, fontSize: "8px", letterSpacing: "0.1em" }}>
        {"★".repeat(review.rating)}
      </div>
      <p
        style={{
          fontSize: "10px",
          color: CREAM,
          fontStyle: "italic",
          lineHeight: 1.35,
          margin: "2px 0 0",
          overflow: "hidden",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical" as const,
        }}
      >
        "{review.text}"
      </p>
      <span style={{ fontSize: "8px", color: MUTED, fontFamily: "monospace" }}>
        — {review.author}
      </span>
    </div>
  );
}

// ── Two rotating review boxes ──────────────────────────────────────────────────
function ReviewTicker({ reviews }: { reviews: Review[] }) {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (reviews.length <= 2) return;
    const t = setInterval(() => {
      setOffset((o) => (o + 2) % reviews.length);
    }, 4000);
    return () => clearInterval(t);
  }, [reviews.length]);

  if (reviews.length === 0) return null;

  const visible = [
    reviews[offset % reviews.length],
    reviews.length > 1 ? reviews[(offset + 1) % reviews.length] : null,
  ].filter(Boolean) as Review[];

  return (
    <div style={{ display: "flex", gap: "6px", marginTop: "8px" }}>
      {visible.map((r, i) => (
        <ReviewBox key={`${offset}-${i}`} review={r} />
      ))}
    </div>
  );
}

// ── The card ───────────────────────────────────────────────────────────────────
export default function MenuItemCard({ item }: { item: MenuItem }) {
  return (
    <div
      style={{
        background: "#0d0d0d",
        border: `2px solid rgba(232,119,34,0.2)`,
        borderRadius: "4px",
        overflow: "hidden",
        boxShadow: `3px 3px 0 ${INK}`,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <MediaTile item={item} />

      <div style={{ padding: "10px 12px 12px" }}>
        {/* Name + price */}
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "8px" }}>
          <span style={{ fontFamily: "monospace", fontWeight: 700, fontSize: "13px", color: CREAM }}>
            {item.name}
          </span>
          <span style={{ fontFamily: "monospace", fontWeight: 900, fontSize: "13px", color: ORANGE, whiteSpace: "nowrap" }}>
            € {item.price.toFixed(2)}
          </span>
        </div>

        {/* Italian description */}
        <p style={{ fontSize: "10px", color: MUTED, fontStyle: "italic", margin: "2px 0 0", lineHeight: 1.4 }}>
          {item.nameIt}
        </p>

        {/* Ingredients */}
        {item.ingredients && item.ingredients.length > 0 && (
          <p style={{ fontSize: "10px", color: "#6a5a4a", fontFamily: "monospace", margin: "6px 0 0", lineHeight: 1.4 }}>
            {item.ingredients.join(" · ")}
          </p>
        )}

        {/* Allergens */}
        {item.allergens && item.allergens.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginTop: "6px" }}>
            {item.allergens.map((a) => (
              <AllergenChip key={a} label={a} />
            ))}
          </div>
        )}

        {/* Reviews */}
        {item.reviews && <ReviewTicker reviews={item.reviews} />}
      </div>
    </div>
  );
}
