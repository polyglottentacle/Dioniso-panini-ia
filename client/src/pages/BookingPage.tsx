import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { apiRequest } from "@/lib/queryClient";
import {
  FULL_HOUSE_MENU,
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  type MenuItem,
} from "@shared/menu-data";
import MenuItemCard from "@/components/menu/MenuItemCard";

// Categories shown as rich visual cards (video + reviews); others as rows
const RICH_CATEGORIES: MenuItem["category"][] = ["starter", "main"];

// ── Design tokens ──────────────────────────────────────────────────────────────
const INK = "#0a0a0a";
const ORANGE = "#e87722";     // Dutch orange
const ORANGE_DARK = "#c45e10";
const CREAM = "#f5f0e8";
const GOLD = "#e4c07f";

const TODAY = new Date().toISOString().split("T")[0];

interface BookingForm {
  guestName: string;
  guestPhone: string;
  date: string;
  time: string;
  partySize: number;
  notes: string;
}

// ── MenuCard ──────────────────────────────────────────────────────────────────
function MenuCard({ item }: { item: MenuItem }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        justifyContent: "space-between",
        gap: "8px",
        padding: "9px 0",
        borderBottom: `1px solid rgba(232,119,34,0.12)`,
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <span
          style={{
            fontFamily: "monospace",
            fontWeight: 700,
            fontSize: "12px",
            color: CREAM,
            display: "block",
          }}
        >
          {item.name}
        </span>
        <span
          style={{
            fontSize: "10px",
            color: "#8a8070",
            fontStyle: "italic",
            display: "block",
            marginTop: "1px",
          }}
        >
          {item.nameIt}
        </span>
      </div>
      <span
        style={{
          fontFamily: "monospace",
          fontWeight: 900,
          fontSize: "12px",
          color: ORANGE,
          whiteSpace: "nowrap",
          flexShrink: 0,
        }}
      >
        € {item.price.toFixed(2)}
      </span>
    </div>
  );
}

// ── MenuSection ───────────────────────────────────────────────────────────────
function MenuSection({
  category,
  items,
}: {
  category: MenuItem["category"];
  items: MenuItem[];
}) {
  const [open, setOpen] = useState(category === "starter" || category === "main");
  const labels = CATEGORY_LABELS[category];

  return (
    <div style={{ marginBottom: "4px" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 0",
          background: "none",
          border: "none",
          cursor: "pointer",
          borderBottom: open ? `2px solid ${ORANGE}` : `1px solid rgba(232,119,34,0.2)`,
        }}
      >
        <span
          style={{
            fontFamily: "monospace",
            fontWeight: 700,
            fontSize: "11px",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: open ? ORANGE : "#6a5a4a",
          }}
        >
          {labels.nl}
        </span>
        <span style={{ color: ORANGE, fontSize: "14px", fontWeight: 900 }}>
          {open ? "−" : "+"}
        </span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            style={{ overflow: "hidden" }}
          >
            {RICH_CATEGORIES.includes(category) ? (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                  gap: "12px",
                  paddingTop: "12px",
                }}
              >
                {items.map((item) => (
                  <MenuItemCard key={item.id} item={item} />
                ))}
              </div>
            ) : (
              items.map((item) => <MenuCard key={item.id} item={item} />)
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── BookingForm ───────────────────────────────────────────────────────────────
function BookingForm() {
  const [form, setForm] = useState<BookingForm>({
    guestName: "",
    guestPhone: "",
    date: TODAY,
    time: "19:00",
    partySize: 2,
    notes: "",
  });
  const [done, setDone] = useState(false);

  const mutation = useMutation({
    mutationFn: (data: BookingForm) => apiRequest("POST", "/api/reservations", data),
    onSuccess: () => setDone(true),
  });

  const update = (k: keyof BookingForm, v: string | number) =>
    setForm((f) => ({ ...f, [k]: v }));

  if (done) {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        style={{
          textAlign: "center",
          padding: "32px 16px",
        }}
      >
        <div
          style={{
            width: "64px",
            height: "64px",
            background: ORANGE,
            border: `3px solid ${INK}`,
            boxShadow: `4px 4px 0 ${INK}`,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
            fontSize: "28px",
            fontWeight: 900,
            color: INK,
          }}
        >
          ✓
        </div>
        <h3
          style={{
            fontFamily: "monospace",
            fontWeight: 900,
            fontSize: "18px",
            color: CREAM,
            marginBottom: "8px",
            letterSpacing: "0.05em",
          }}
        >
          Prenotazione ricevuta!
        </h3>
        <p style={{ fontSize: "12px", color: "#8a8070", lineHeight: 1.6 }}>
          {form.guestName}, we zien je op {form.date} om {form.time}.
          <br />
          Jan zal uw reservering bevestigen.
        </p>
        <button
          onClick={() => { setDone(false); setForm({ guestName: "", guestPhone: "", date: TODAY, time: "19:00", partySize: 2, notes: "" }); }}
          style={{
            marginTop: "20px",
            padding: "8px 20px",
            background: "transparent",
            border: `2px solid rgba(232,119,34,0.4)`,
            borderRadius: "3px",
            color: ORANGE,
            fontFamily: "monospace",
            fontSize: "10px",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            cursor: "pointer",
          }}
        >
          Nieuwe reservering
        </button>
      </motion.div>
    );
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "rgba(255,255,255,0.05)",
    border: `2px solid rgba(232,119,34,0.25)`,
    borderRadius: "3px",
    padding: "10px 12px",
    fontSize: "13px",
    color: CREAM,
    fontFamily: "monospace",
    boxSizing: "border-box",
    outline: "none",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <input
        placeholder="Uw naam / Il tuo nome"
        value={form.guestName}
        onChange={(e) => update("guestName", e.target.value)}
        style={inputStyle}
      />
      <input
        placeholder="Telefoonnummer"
        value={form.guestPhone}
        onChange={(e) => update("guestPhone", e.target.value)}
        style={inputStyle}
      />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
        <input
          type="date"
          value={form.date}
          min={TODAY}
          onChange={(e) => update("date", e.target.value)}
          style={inputStyle}
        />
        <input
          type="time"
          value={form.time}
          onChange={(e) => update("time", e.target.value)}
          style={inputStyle}
        />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", alignItems: "center" }}>
        <div>
          <label style={{ fontSize: "9px", fontFamily: "monospace", letterSpacing: "0.15em", textTransform: "uppercase", color: "#6a5a4a", display: "block", marginBottom: "4px" }}>
            Aantal personen
          </label>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button
              onClick={() => update("partySize", Math.max(1, form.partySize - 1))}
              style={{ width: "28px", height: "28px", background: ORANGE, border: `2px solid ${INK}`, boxShadow: `2px 2px 0 ${INK}`, borderRadius: "2px", fontWeight: 900, fontSize: "16px", color: INK, cursor: "pointer", lineHeight: 1, display: "flex", alignItems: "center", justifyContent: "center" }}
            >−</button>
            <span style={{ fontFamily: "monospace", fontWeight: 900, fontSize: "20px", color: CREAM, minWidth: "24px", textAlign: "center" }}>
              {form.partySize}
            </span>
            <button
              onClick={() => update("partySize", Math.min(20, form.partySize + 1))}
              style={{ width: "28px", height: "28px", background: ORANGE, border: `2px solid ${INK}`, boxShadow: `2px 2px 0 ${INK}`, borderRadius: "2px", fontWeight: 900, fontSize: "16px", color: INK, cursor: "pointer", lineHeight: 1, display: "flex", alignItems: "center", justifyContent: "center" }}
            >+</button>
          </div>
        </div>
        <div />
      </div>
      <textarea
        placeholder="Opmerkingen / Note (allergie, occasione...)"
        value={form.notes}
        onChange={(e) => update("notes", e.target.value)}
        rows={2}
        style={{ ...inputStyle, resize: "none" }}
      />
      <button
        onClick={() => mutation.mutate(form)}
        disabled={!form.guestName || !form.guestPhone || mutation.isPending}
        style={{
          padding: "13px",
          background: mutation.isPending ? ORANGE_DARK : ORANGE,
          border: `3px solid ${INK}`,
          boxShadow: `4px 4px 0 ${INK}`,
          borderRadius: "3px",
          fontFamily: "monospace",
          fontWeight: 900,
          fontSize: "14px",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: INK,
          cursor: mutation.isPending ? "not-allowed" : "pointer",
          opacity: (!form.guestName || !form.guestPhone) ? 0.5 : 1,
          transition: "opacity 0.15s",
        }}
      >
        {mutation.isPending ? "Even geduld..." : "Reserveer een tafel"}
      </button>
      {mutation.isError && (
        <p style={{ fontSize: "11px", color: "#e87722", fontFamily: "monospace", textAlign: "center" }}>
          Er ging iets mis. Probeer het opnieuw.
        </p>
      )}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function BookingPage() {
  const byCategory = CATEGORY_ORDER.map((cat) => ({
    cat,
    items: FULL_HOUSE_MENU.filter((i) => i.category === cat),
  }));

  return (
    <div
      style={{
        minHeight: "100vh",
        background: INK,
        color: CREAM,
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Header */}
      <header
        style={{
          borderBottom: `3px solid ${ORANGE}`,
          padding: "18px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#0f0f0f",
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "monospace",
              fontSize: "9px",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: ORANGE,
              marginBottom: "2px",
            }}
          >
            Eetcafé
          </div>
          <div
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 900,
              fontSize: "22px",
              color: CREAM,
              lineHeight: 1,
            }}
          >
            Full House
          </div>
        </div>
        {/* Dutch flag colors strip */}
        <div style={{ display: "flex", gap: "3px", alignItems: "center" }}>
          {["#AE1C28", "#FFFFFF", "#21468B"].map((c) => (
            <div
              key={c}
              style={{
                width: "8px",
                height: "28px",
                background: c,
                border: `1px solid ${INK}`,
              }}
            />
          ))}
        </div>
      </header>

      {/* Body — 2 column on md+ */}
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "0",
        }}
        className="md:grid-cols-[1fr_380px]"
      >
        {/* Left — Menu */}
        <div
          style={{
            padding: "24px 20px",
            borderRight: "1px solid rgba(232,119,34,0.15)",
          }}
        >
          <h2
            style={{
              fontFamily: "monospace",
              fontWeight: 700,
              fontSize: "11px",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: ORANGE,
              marginBottom: "18px",
            }}
          >
            Menu
          </h2>
          <p
            style={{
              fontSize: "11px",
              color: "#6a5a4a",
              fontStyle: "italic",
              marginBottom: "16px",
              lineHeight: 1.5,
            }}
          >
            Bediening aanwezig. Hoofdgerechten geserveerd met friet, gebakken aardappelen, groenten en salade.
          </p>
          {byCategory.map(({ cat, items }) => (
            <MenuSection key={cat} category={cat} items={items} />
          ))}
          <p
            style={{
              marginTop: "20px",
              fontSize: "10px",
              color: "#4a3a2a",
              fontFamily: "monospace",
              textAlign: "center",
              letterSpacing: "0.1em",
            }}
          >
            De Veste 1692 · 8231 JK Lelystad
          </p>
        </div>

        {/* Right — Booking */}
        <div
          style={{
            padding: "24px 20px",
            background: "#0d0d0d",
          }}
        >
          <h2
            style={{
              fontFamily: "monospace",
              fontWeight: 700,
              fontSize: "11px",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: ORANGE,
              marginBottom: "18px",
            }}
          >
            Reserveer een tafel
          </h2>
          <BookingForm />

          <div
            style={{
              marginTop: "20px",
              padding: "12px",
              border: `1px solid rgba(232,119,34,0.15)`,
              borderRadius: "3px",
            }}
          >
            <p
              style={{
                fontSize: "10px",
                fontFamily: "monospace",
                color: "#6a5a4a",
                lineHeight: 1.6,
                letterSpacing: "0.04em",
              }}
            >
              Reserveringen worden bevestigd door Jan.
              <br />
              Belt u liever? <span style={{ color: ORANGE }}>+31 320 282 428</span>
              <br />
              Di–zo open van 11:00 tot 22:00.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer
        style={{
          borderTop: `1px solid rgba(232,119,34,0.12)`,
          padding: "14px 20px",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontSize: "9px",
            fontFamily: "monospace",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#3a2a1a",
          }}
        >
          Powered by Elena · Eetcafé Full House · Lelystad 2026
        </p>
      </footer>
    </div>
  );
}
