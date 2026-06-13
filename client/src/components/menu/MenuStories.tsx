import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FULL_HOUSE_MENU, CATEGORY_LABELS, CATEGORY_ORDER, type MenuItem } from "@shared/menu-data";

const GOLD   = "#e4c07f";
const ORANGE = "#e87722";
const INK    = "#09010f";
const RED    = "#c84040";

// All dish categories (skip drinks/wine in stories)
const STORY_CATS = (CATEGORY_ORDER as string[]).filter(
  (c) => c !== "drink" && c !== "wine" && c !== "coffee"
) as MenuItem["category"][];

const DISHES = FULL_HOUSE_MENU.filter((m) => STORY_CATS.includes(m.category));

interface Props {
  onClose: () => void;
}

export default function MenuStories({ onClose }: Props) {
  const [catIndex, setCatIndex] = useState(0);
  const [dishIndex, setDishIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const currentCat = STORY_CATS[catIndex];
  const catDishes = DISHES.filter((d) => d.category === currentCat);
  const dish = catDishes[dishIndex] ?? catDishes[0];
  const total = catDishes.length;

  const goNext = useCallback(() => {
    if (dishIndex < total - 1) {
      setDishIndex((i) => i + 1);
    } else if (catIndex < STORY_CATS.length - 1) {
      setCatIndex((c) => c + 1);
      setDishIndex(0);
    }
  }, [dishIndex, total, catIndex]);

  const goPrev = useCallback(() => {
    if (dishIndex > 0) {
      setDishIndex((i) => i - 1);
    } else if (catIndex > 0) {
      const prevCat = STORY_CATS[catIndex - 1];
      const prevDishes = DISHES.filter((d) => d.category === prevCat);
      setCatIndex((c) => c - 1);
      setDishIndex(prevDishes.length - 1);
    }
  }, [dishIndex, catIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") goNext();
      if (e.key === "ArrowLeft"  || e.key === "ArrowUp")   goPrev();
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [goNext, goPrev, onClose]);

  // Restart video when dish changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  }, [dish?.id]);

  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.touches[0].clientX);
  const handleTouchEnd   = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const dx = e.changedTouches[0].clientX - touchStart;
    if (Math.abs(dx) > 50) dx < 0 ? goNext() : goPrev();
    setTouchStart(null);
  };

  if (!dish) return null;

  const isFirst = catIndex === 0 && dishIndex === 0;
  const isLast  = catIndex === STORY_CATS.length - 1 && dishIndex === total - 1;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        background: INK,
        display: "flex", flexDirection: "column",
        fontFamily: "'Georgia', serif",
        userSelect: "none",
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* ── Video or gradient background ── */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        {dish.videoUrl ? (
          <video
            ref={videoRef}
            src={dish.videoUrl}
            autoPlay muted loop playsInline
            style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.28 }}
          />
        ) : (
          <div style={{
            position: "absolute", inset: 0,
            background: `radial-gradient(ellipse at 60% 30%, rgba(228,192,127,0.08) 0%, transparent 70%)`,
          }} />
        )}
        {/* Dark vignette always on top of video */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, rgba(9,1,15,0.55) 0%, rgba(9,1,15,0.2) 40%, rgba(9,1,15,0.85) 100%)",
        }} />
      </div>

      {/* ── Progress bars ── */}
      <div style={{
        position: "relative", zIndex: 2,
        display: "flex", gap: "3px", padding: "14px 16px 8px",
      }}>
        {catDishes.map((_, i) => (
          <div key={i} style={{
            flex: 1, height: "2px",
            background: i <= dishIndex ? GOLD : "rgba(228,192,127,0.25)",
            borderRadius: "2px",
            transition: "background 0.2s",
          }} />
        ))}
      </div>

      {/* ── Top bar: category + close ── */}
      <div style={{
        position: "relative", zIndex: 2,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 16px 12px",
      }}>
        {/* Category tabs */}
        <div style={{ display: "flex", gap: "8px", overflowX: "auto", flex: 1 }}>
          {STORY_CATS.map((cat, i) => (
            <button
              key={cat}
              onClick={() => { setCatIndex(i); setDishIndex(0); }}
              style={{
                background: "none", border: "none", cursor: "pointer",
                fontFamily: "monospace", fontSize: "9px", letterSpacing: "0.15em",
                textTransform: "uppercase", whiteSpace: "nowrap",
                color: i === catIndex ? GOLD : "rgba(228,192,127,0.35)",
                borderBottom: i === catIndex ? `1px solid ${GOLD}` : "1px solid transparent",
                paddingBottom: "2px",
              }}
            >
              {CATEGORY_LABELS[cat].nl}
            </button>
          ))}
        </div>
        <button
          onClick={onClose}
          style={{
            background: "none", border: "none", cursor: "pointer",
            color: "rgba(228,192,127,0.6)", fontSize: "22px", lineHeight: 1,
            marginLeft: "12px", flexShrink: 0,
          }}
        >×</button>
      </div>

      {/* ── Main dish card ── */}
      <div style={{ flex: 1, position: "relative", zIndex: 2, display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "0 24px 32px" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={dish.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22 }}
          >
            {/* Category label */}
            <div style={{
              fontFamily: "monospace", fontSize: "9px", letterSpacing: "0.2em",
              textTransform: "uppercase", color: RED, marginBottom: "6px",
            }}>
              {CATEGORY_LABELS[dish.category].nl}
            </div>

            {/* Dish name */}
            <h1 style={{
              margin: "0 0 6px",
              fontSize: "clamp(26px, 6vw, 42px)",
              fontWeight: 700, lineHeight: 1.1,
              color: GOLD,
              textShadow: "0 2px 12px rgba(0,0,0,0.8)",
            }}>
              {dish.name}
            </h1>

            {/* Italian subtitle */}
            <p style={{
              margin: "0 0 14px",
              fontSize: "clamp(13px, 3vw, 16px)",
              fontStyle: "italic",
              color: "rgba(228,192,127,0.65)",
              lineHeight: 1.4,
            }}>
              {dish.nameIt}
            </p>

            {/* Ingredients */}
            {dish.ingredients && dish.ingredients.length > 0 && (
              <p style={{
                margin: "0 0 14px",
                fontSize: "11px", fontFamily: "monospace",
                color: "rgba(255,255,255,0.45)",
                letterSpacing: "0.04em",
              }}>
                {dish.ingredients.join("  ·  ")}
              </p>
            )}

            {/* Allergens */}
            {dish.allergens && dish.allergens.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginBottom: "16px" }}>
                {dish.allergens.map((a) => (
                  <span key={a} style={{
                    padding: "2px 7px", borderRadius: "2px",
                    border: `1px solid rgba(228,192,127,0.3)`,
                    fontSize: "9px", fontFamily: "monospace", letterSpacing: "0.1em",
                    color: "rgba(228,192,127,0.5)",
                  }}>{a}</span>
                ))}
              </div>
            )}

            {/* Price + counter */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{
                fontSize: "clamp(28px, 7vw, 44px)",
                fontWeight: 900, fontFamily: "monospace",
                color: ORANGE,
                textShadow: "0 2px 8px rgba(0,0,0,0.6)",
              }}>
                € {dish.price.toFixed(2)}
              </span>
              <span style={{
                fontFamily: "monospace", fontSize: "11px",
                color: "rgba(228,192,127,0.4)",
              }}>
                {dishIndex + 1} / {total}
              </span>
            </div>

            {/* Reviews */}
            {dish.reviews && dish.reviews.length > 0 && (
              <div style={{
                marginTop: "14px", padding: "10px 14px",
                background: "rgba(228,192,127,0.06)",
                border: `1px solid rgba(228,192,127,0.15)`,
                borderRadius: "3px",
              }}>
                <span style={{ fontSize: "11px", fontStyle: "italic", color: "rgba(228,192,127,0.6)" }}>
                  "{dish.reviews[0].text}"
                </span>
                <span style={{ fontSize: "10px", fontFamily: "monospace", color: "rgba(228,192,127,0.35)", marginLeft: "6px" }}>
                  — {dish.reviews[0].author}
                </span>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Left / Right tap zones (invisible) ── */}
      <div style={{ position: "absolute", inset: 0, zIndex: 3, display: "flex", pointerEvents: "none" }}>
        <div
          style={{ flex: 1, cursor: isFirst ? "default" : "w-resize", pointerEvents: "auto" }}
          onClick={goPrev}
        />
        <div style={{ width: "40%" }} /> {/* center: no tap */}
        <div
          style={{ flex: 1, cursor: isLast ? "default" : "e-resize", pointerEvents: "auto" }}
          onClick={goNext}
        />
      </div>

      {/* ── Arrow hints ── */}
      {!isFirst && (
        <div style={{
          position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", zIndex: 4,
          color: "rgba(228,192,127,0.3)", fontSize: "28px", pointerEvents: "none",
        }}>‹</div>
      )}
      {!isLast && (
        <div style={{
          position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", zIndex: 4,
          color: "rgba(228,192,127,0.3)", fontSize: "28px", pointerEvents: "none",
        }}>›</div>
      )}
    </motion.div>
  );
}
