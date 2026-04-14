import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface Reservation {
  id: number;
  guestName: string;
  guestPhone: string;
  date: string;
  time: string;
  partySize: number;
  status: string;
  notes?: string;
}

interface NewReservationForm {
  guestName: string;
  guestPhone: string;
  date: string;
  time: string;
  partySize: number;
  notes: string;
}

const STATUS_BADGE: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const STATUS_LABELS: Record<string, string> = {
  pending: "In attesa",
  confirmed: "Confermata",
  cancelled: "Cancellata",
};

const TODAY = new Date().toISOString().split("T")[0];

export default function ReservationPanel() {
  const qc = useQueryClient();
  const [view, setView] = useState<"today" | "week">("today");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<NewReservationForm>({
    guestName: "",
    guestPhone: "",
    date: TODAY,
    time: "19:00",
    partySize: 2,
    notes: "",
  });

  const { data: today = [] } = useQuery<Reservation[]>({
    queryKey: ["/api/reservations/today"],
  });

  const { data: week = [] } = useQuery<Reservation[]>({
    queryKey: ["/api/reservations/week"],
  });

  const reservations = view === "today" ? today : week;

  const createMutation = useMutation({
    mutationFn: (data: NewReservationForm) =>
      apiRequest("POST", "/api/reservations", data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/reservations/today"] });
      qc.invalidateQueries({ queryKey: ["/api/reservations/week"] });
      setShowForm(false);
      setForm({ guestName: "", guestPhone: "", date: TODAY, time: "19:00", partySize: 2, notes: "" });
    },
  });

  const confirmMutation = useMutation({
    mutationFn: (id: number) =>
      apiRequest("PATCH", `/api/reservations/${id}/status`, { status: "confirmed" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/reservations/today"] });
      qc.invalidateQueries({ queryKey: ["/api/reservations/week"] });
    },
  });

  const todayCount = today.filter((r) => r.status !== "cancelled").length;
  const weekCount = week.filter((r) => r.status !== "cancelled").length;
  const totalCovers = today
    .filter((r) => r.status !== "cancelled")
    .reduce((s, r) => s + r.partySize, 0);

  return (
    <div className="flex flex-col h-full gap-4 overflow-hidden">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "Oggi", value: todayCount },
          { label: "Settimana", value: weekCount },
          { label: "Coperti oggi", value: totalCovers },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
            <div className="text-2xl font-black text-[#d4af37]">{value}</div>
            <div className="text-[10px] uppercase tracking-widest text-gray-400 font-mono">{label}</div>
          </div>
        ))}
      </div>

      {/* Toggle oggi / settimana */}
      <div className="flex rounded-full border border-white/10 overflow-hidden text-xs font-mono">
        {(["today", "week"] as const).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`flex-1 py-1.5 transition ${
              view === v ? "bg-[#d4af37] text-black font-bold" : "text-gray-400 hover:text-white"
            }`}
          >
            {v === "today" ? "Oggi" : "Settimana"}
          </button>
        ))}
      </div>

      {/* Lista prenotazioni */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {reservations.length === 0 ? (
          <p className="text-center text-gray-600 text-sm py-8 font-mono italic">
            Nessuna prenotazione
          </p>
        ) : (
          reservations.map((r) => (
            <div
              key={r.id}
              className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center justify-between gap-2"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm truncate">{r.guestName}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${STATUS_BADGE[r.status] || STATUS_BADGE.pending}`}>
                    {STATUS_LABELS[r.status] || r.status}
                  </span>
                </div>
                <div className="text-xs text-gray-400 font-mono mt-0.5">
                  {r.time} · {r.partySize} persone · {r.date}
                </div>
              </div>
              {r.status === "pending" && (
                <button
                  onClick={() => confirmMutation.mutate(r.id)}
                  className="text-[10px] px-2 py-1 bg-green-600 text-white rounded-full hover:bg-green-700 font-bold whitespace-nowrap"
                >
                  Conferma
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {/* Form nuova prenotazione */}
      {showForm ? (
        <div className="bg-white/5 border border-[#d4af37]/30 rounded-2xl p-4 space-y-2">
          <h4 className="text-sm font-bold text-[#d4af37] font-mono uppercase tracking-widest">
            Nuova Prenotazione
          </h4>
          <div className="grid grid-cols-2 gap-2">
            <input
              placeholder="Nome ospite"
              value={form.guestName}
              onChange={(e) => setForm((f) => ({ ...f, guestName: e.target.value }))}
              className="bg-white/10 border border-white/20 rounded-lg px-2 py-1.5 text-sm text-white placeholder:text-gray-500 col-span-2"
            />
            <input
              placeholder="Telefono"
              value={form.guestPhone}
              onChange={(e) => setForm((f) => ({ ...f, guestPhone: e.target.value }))}
              className="bg-white/10 border border-white/20 rounded-lg px-2 py-1.5 text-sm text-white placeholder:text-gray-500"
            />
            <input
              type="number"
              min={1}
              max={20}
              placeholder="Persone"
              value={form.partySize}
              onChange={(e) => setForm((f) => ({ ...f, partySize: parseInt(e.target.value) || 2 }))}
              className="bg-white/10 border border-white/20 rounded-lg px-2 py-1.5 text-sm text-white"
            />
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              className="bg-white/10 border border-white/20 rounded-lg px-2 py-1.5 text-sm text-white"
            />
            <input
              type="time"
              value={form.time}
              onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
              className="bg-white/10 border border-white/20 rounded-lg px-2 py-1.5 text-sm text-white"
            />
            <input
              placeholder="Note (opz.)"
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              className="bg-white/10 border border-white/20 rounded-lg px-2 py-1.5 text-sm text-white placeholder:text-gray-500 col-span-2"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowForm(false)}
              className="flex-1 py-1.5 border border-white/20 rounded-lg text-sm text-gray-400 hover:text-white"
            >
              Annulla
            </button>
            <button
              onClick={() => createMutation.mutate(form)}
              disabled={!form.guestName || !form.guestPhone || createMutation.isPending}
              className="flex-1 py-1.5 bg-[#d4af37] text-black font-bold rounded-lg text-sm disabled:opacity-50"
            >
              {createMutation.isPending ? "..." : "Salva"}
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="w-full py-2.5 border-2 border-dashed border-[#d4af37]/40 rounded-2xl text-[#d4af37] text-sm font-mono hover:border-[#d4af37] hover:bg-[#d4af37]/5 transition"
        >
          + Nuova Prenotazione
        </button>
      )}
    </div>
  );
}
