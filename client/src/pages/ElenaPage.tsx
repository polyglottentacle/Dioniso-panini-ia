import { useState, useCallback, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { motion } from "framer-motion";
import RestaurantMap from "@/components/elena/RestaurantMap";
import ReservationPanel from "@/components/elena/ReservationPanel";
import OwnerModePanel from "@/components/elena/OwnerModePanel";
import { useWebSocket, type WSMessage } from "@/hooks/use-websocket";
import { useAudioContext } from "@/contexts/AudioContext";
import { useAudio } from "@/hooks/use-audio";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { TableData } from "@/components/elena/TableSquare";

export default function ElenaPage() {
  const qc = useQueryClient();
  const [ownerModeOpen, setOwnerModeOpen] = useState(false);
  const { toast } = useToast();
  const { soundEnabled, volume } = useAudioContext();
  const { playNewReservationAlert } = useAudio(soundEnabled, volume);

  // The server (MemStorage or DB) always seeds the floor plan — no client demo data
  const { data: tables = [] } = useQuery<TableData[]>({
    queryKey: ["/api/tables"],
    retry: false,
  });

  // Optimistic position update: the table stays where you dropped it,
  // rolls back with a toast only if the server rejects the move
  const updateTableMutation = useMutation({
    mutationFn: ({ id, x, y }: { id: number; x: number; y: number }) =>
      apiRequest("PATCH", `/api/tables/${id}`, { x, y }),
    onMutate: async ({ id, x, y }) => {
      await qc.cancelQueries({ queryKey: ["/api/tables"] });
      const previous = qc.getQueryData<TableData[]>(["/api/tables"]);
      qc.setQueryData<TableData[]>(["/api/tables"], (old) =>
        (old ?? []).map((t) => (t.id === id ? { ...t, x, y } : t))
      );
      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) qc.setQueryData(["/api/tables"], ctx.previous);
      toast({ title: "Spostamento non salvato", description: "Il server ha rifiutato la modifica. Riprova.", variant: "destructive" });
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["/api/tables"] }),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: TableData["status"] }) =>
      apiRequest("PATCH", `/api/tables/${id}`, { status }),
    onMutate: async ({ id, status }) => {
      await qc.cancelQueries({ queryKey: ["/api/tables"] });
      const previous = qc.getQueryData<TableData[]>(["/api/tables"]);
      qc.setQueryData<TableData[]>(["/api/tables"], (old) =>
        (old ?? []).map((t) => (t.id === id ? { ...t, status } : t))
      );
      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) qc.setQueryData(["/api/tables"], ctx.previous);
      toast({ title: "Stato non salvato", description: "Riprova.", variant: "destructive" });
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["/api/tables"] }),
  });

  const mergeTablesMutation = useMutation({
    mutationFn: (ids: number[]) => apiRequest("POST", "/api/tables/merge", { ids }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/tables"] });
      toast({ title: "Tavoli uniti!", description: "La mappa è stata aggiornata." });
    },
    onError: () => {
      toast({ title: "Unione non riuscita", description: "Controlla i tavoli selezionati e riprova.", variant: "destructive" });
    },
  });

  const unmergeTableMutation = useMutation({
    mutationFn: (id: number) => apiRequest("POST", "/api/tables/unmerge", { id }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/tables"] });
      toast({ title: "Tavoli divisi", description: "Il tavolo è tornato alla configurazione originale." });
    },
    onError: () => {
      toast({ title: "Divisione non riuscita", description: "Riprova.", variant: "destructive" });
    },
  });

  const walkInMutation = useMutation({
    mutationFn: ({ id, partySize }: { id: number; partySize: number }) =>
      apiRequest("POST", `/api/tables/${id}/walkin`, { partySize }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/tables"] });
      qc.invalidateQueries({ queryKey: ["/api/reservations/today"] });
      toast({ title: "Walk-in registrato", description: "Tavolo occupato e prenotazione creata." });
    },
    onError: () => {
      toast({ title: "Walk-in non riuscito", description: "Il tavolo potrebbe essere già occupato.", variant: "destructive" });
    },
  });

  const handleTableUpdate = useCallback((id: number, x: number, y: number) => {
    updateTableMutation.mutate({ id, x, y });
  }, [updateTableMutation]);

  const handleWalkIn = useCallback((id: number, partySize: number) => {
    walkInMutation.mutate({ id, partySize });
  }, [walkInMutation]);

  const handleMergeTables = useCallback((ids: number[]) => {
    mergeTablesMutation.mutate(ids);
  }, [mergeTablesMutation]);

  const handleUnmergeTable = useCallback((id: number) => {
    unmergeTableMutation.mutate(id);
  }, [unmergeTableMutation]);

  const handleStatusCycle = useCallback((id: number, status: TableData["status"]) => {
    statusMutation.mutate({ id, status });
  }, [statusMutation]);

  // WebSocket — aggiornamenti in tempo reale sulla mappa
  const handleWSMessage = useCallback((msg: WSMessage) => {
    if (msg.type === "new_reservation") {
      playNewReservationAlert();
      qc.invalidateQueries({ queryKey: ["/api/reservations/today"] });
      qc.invalidateQueries({ queryKey: ["/api/tables"] });
      const res = msg.reservation as { guestName?: string; partySize?: number } | undefined;
      toast({
        title: "Nuova prenotazione ricevuta!",
        description: `${res?.guestName || "Ospite"} — ${res?.partySize || "?"} persone`,
      });
    }
    if (msg.type === "table_updated" || msg.type === "tables_merged") {
      qc.invalidateQueries({ queryKey: ["/api/tables"] });
    }
  }, [playNewReservationAlert, qc, toast]);

  useWebSocket({ onMessage: handleWSMessage });

  // "Colpo di scena" — longpress sul logo Diana (500ms)
  const pressTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const handleLogoPressStart = () => {
    clearTimeout(pressTimerRef.current);
    pressTimerRef.current = setTimeout(() => setOwnerModeOpen(true), 500);
  };
  const handleLogoPressEnd = () => clearTimeout(pressTimerRef.current);

  const tableStats = {
    free: tables.filter((t) => t.status === "free").length,
    occupied: tables.filter((t) => t.status === "occupied").length,
    reserved: tables.filter((t) => t.status === "reserved").length,
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        fontFamily: "'Inter', sans-serif",
        backgroundColor: "#080808",
        color: "#e0e0e0",
      }}
    >
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/5">
        <div className="flex items-center gap-4">
          <Link href="/">
            <button className="text-gray-500 hover:text-white text-xs font-mono uppercase tracking-widest transition">
              ← App
            </button>
          </Link>
          {/* Longpress sul logo attiva Owner Mode */}
          <button
            onMouseDown={handleLogoPressStart}
            onMouseUp={handleLogoPressEnd}
            onTouchStart={handleLogoPressStart}
            onTouchEnd={handleLogoPressEnd}
            className="text-2xl font-black select-none"
            style={{
              fontFamily: "'Playfair Display', serif",
              color: "#d4af37",
              textShadow: "0 0 20px rgba(212,175,55,0.4)",
            }}
            title="Tieni premuto per Owner Mode"
          >
            DIANA.
          </button>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex gap-4 text-[10px] font-mono uppercase tracking-widest">
            <span className="text-yellow-400">{tableStats.free} liberi</span>
            <span className="text-red-400">{tableStats.occupied} occupati</span>
            <span className="text-blue-400 animate-pulse">{tableStats.reserved} prenotati</span>
          </div>
          <button
            onClick={() => setOwnerModeOpen(true)}
            className="text-[10px] border border-[#d4af37]/40 px-4 py-1.5 rounded-full hover:bg-[#d4af37]/10 transition font-mono uppercase tracking-widest"
          >
            Owner Mode
          </button>
        </div>
      </nav>

      {/* Layout iPad split 50/50 */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">

        {/* ── PANNELLO SINISTRO: Prenotazioni ── */}
        <div
          className="md:w-1/2 flex flex-col p-6 border-b md:border-b-0 md:border-r border-white/5 overflow-y-auto"
          style={{ maxHeight: "calc(100vh - 65px)" }}
        >
          <div className="mb-4">
            <h2 className="text-xs font-mono uppercase tracking-[0.3em] text-[#d4af37] mb-1">
              Eetcafé Full House
            </h2>
            <h1
              className="text-3xl font-black"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Prenotazioni
            </h1>
          </div>
          <ReservationPanel />
        </div>

        {/* ── PANNELLO DESTRO: Mappa Cartoon 2D ── */}
        <div
          className="md:w-1/2 flex flex-col p-6 overflow-hidden"
          style={{ maxHeight: "calc(100vh - 65px)" }}
        >
          <div className="mb-4">
            <h2 className="text-xs font-mono uppercase tracking-[0.3em] text-[#d4af37] mb-1">
              Mappa del Locale
            </h2>
            <h1
              className="text-3xl font-black"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Tavoli
            </h1>
          </div>
          <div className="flex-1">
            <RestaurantMap
              tables={tables}
              onTableUpdate={handleTableUpdate}
              onMergeTables={handleMergeTables}
              onUnmergeTable={handleUnmergeTable}
              onStatusCycle={handleStatusCycle}
              onWalkIn={handleWalkIn}
            />
          </div>
        </div>
      </div>

      {/* Pilastri Elena (footer visivo) */}
      <div className="border-t border-white/5 px-6 py-6">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-4">
          {[
            {
              icon: "🎙️",
              name: "Hermès",
              color: "#d4af37",
              desc: "Voce clonata — risponde al telefono con la tua voce",
              tech: "ElevenLabs + n8n",
            },
            {
              icon: "📱",
              name: "Iris",
              color: "#00c6ff",
              desc: "Conferme SMS, menu digitale, calendario automatico",
              tech: "WhatsApp AgentKit",
            },
            {
              icon: "🏹",
              name: "Eros",
              color: "#ff4e50",
              desc: "Algoritmi virali — riempie i tuoi tavoli ogni sera",
              tech: "Social Viral Loop",
            },
          ].map(({ icon, name, color, desc, tech }) => (
            <motion.div
              key={name}
              whileHover={{ y: -4 }}
              className="bg-white/3 border border-white/10 rounded-2xl p-4 hover:border-opacity-60 transition"
              style={{ borderColor: `${color}30` }}
            >
              <div className="text-2xl mb-2">{icon}</div>
              <div className="font-serif font-bold text-lg" style={{ color }}>
                {name}
              </div>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">{desc}</p>
              <div className="mt-3 text-[9px] font-mono text-gray-600 uppercase tracking-widest">
                {tech}
              </div>
            </motion.div>
          ))}
        </div>

        <p className="text-center text-[10px] font-mono text-gray-700 mt-4 uppercase tracking-widest">
          Diana · Eetcafé Full House · Lelystad 2026
        </p>
      </div>

      {/* Owner Mode Panel (colpo di scena) */}
      <OwnerModePanel
        isOpen={ownerModeOpen}
        onClose={() => setOwnerModeOpen(false)}
      />
    </div>
  );
}
