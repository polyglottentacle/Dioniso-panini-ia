#!/usr/bin/env node
/**
 * Smoke test for Elena — tables mechanics + chat engine + pages.
 * Boots its own server on PORT 5099 with MemStorage, runs the suite, exits.
 *
 *   npm run smoke
 */

import { spawn } from "node:child_process";

const PORT = process.env.SMOKE_PORT || "5099";
const BASE = `http://localhost:${PORT}`;

let passed = 0;
let failed = 0;

function ok(name, cond, detail = "") {
  if (cond) { passed++; console.log(`  PASS  ${name}`); }
  else { failed++; console.log(`  FAIL  ${name} ${detail}`); }
}

async function api(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  let json = null;
  try { json = await res.json(); } catch { /* pages return HTML */ }
  return { status: res.status, json };
}

async function chat(sessionId, message) {
  const { json } = await api("POST", "/api/elena/chat", { sessionId, message });
  return json;
}

async function waitForServer(retries = 40) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(`${BASE}/api/tables`);
      if (res.ok) return true;
    } catch { /* not up yet */ }
    await new Promise((r) => setTimeout(r, 500));
  }
  return false;
}

async function main() {
  console.log("Starting server on port " + PORT + "...");
  const server = spawn("node_modules/.bin/tsx", ["server/index.ts"], {
    env: {
      ...process.env,
      DATABASE_URL: "postgresql://fake:fake@localhost:5432/fake",
      PORT,
      NODE_ENV: "development",
    },
    stdio: "ignore",
    detached: false,
  });

  const up = await waitForServer();
  if (!up) {
    console.error("Server did not start");
    server.kill("SIGKILL");
    process.exit(1);
  }

  try {
    console.log("\n── Pages ──");
    for (const path of ["/", "/elena", "/prenota", "/qr", "/dagstaat"]) {
      const res = await fetch(`${BASE}${path}`);
      ok(`GET ${path} → 200`, res.status === 200, `got ${res.status}`);
    }

    console.log("\n── Tables: seed + validation ──");
    const { json: tables } = await api("GET", "/api/tables");
    ok("7 seeded tables", tables.length === 7, `got ${tables.length}`);

    const move = await api("PATCH", "/api/tables/1", { x: 50, y: 60 });
    ok("move table → 200, label preserved", move.status === 200 && move.json.label === "T1");

    const badStatus = await api("PATCH", "/api/tables/1", { status: "banana" });
    ok("status=banana → 400", badStatus.status === 400);

    const badX = await api("PATCH", "/api/tables/1", { x: 9999 });
    ok("x=9999 → 400", badX.status === 400);

    const missing = await api("PATCH", "/api/tables/999", { x: 50 });
    ok("unknown table → 404", missing.status === 404);

    console.log("\n── Tables: merge / unmerge ──");
    const merged = await api("POST", "/api/tables/merge", { ids: [1, 2] });
    ok("merge T1+T2 capacity 8", merged.json.capacity === 8, `got ${merged.json.capacity}`);

    const restored = await api("POST", "/api/tables/unmerge", { id: 1 });
    ok("unmerge restores capacity 4 width 80",
      restored.json.capacity === 4 && restored.json.width === 80);

    const notMerged = await api("POST", "/api/tables/unmerge", { id: 3 });
    ok("unmerge non-merged → 400", notMerged.status === 400);

    console.log("\n── Walk-in ──");
    const walkin = await api("POST", "/api/tables/3/walkin", { partySize: 4 });
    ok("walk-in → 201, table occupied",
      walkin.status === 201 && walkin.json.table.status === "occupied");
    ok("walk-in reservation has tableId 3",
      walkin.json.reservation.tableId === 3);

    const walkinBusy = await api("POST", "/api/tables/3/walkin", { partySize: 2 });
    ok("walk-in on occupied → 409", walkinBusy.status === 409);

    console.log("\n── Assignment engine ──");
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];
    const mk = (name, time, size) => api("POST", "/api/reservations",
      { guestName: name, guestPhone: "0611111111", date: tomorrow, time, partySize: size, notes: null, status: "pending", tableId: null });

    const r1 = await mk("Anna", "19:00", 4);
    const r2 = await mk("Bram", "19:00", 4);
    ok("two 4p same slot → different tables",
      r1.json.tableId !== null && r2.json.tableId !== null && r1.json.tableId !== r2.json.tableId);

    const r3 = await mk("Cees", "19:30", 4);
    ok("19:30 within turn → third table",
      r3.json.tableId !== r1.json.tableId && r3.json.tableId !== r2.json.tableId);

    const r4 = await mk("Dirk", "19:00", 8);
    ok("8p → VIP (capacity 8)", r4.json.tableId === 4, `got ${r4.json.tableId}`);

    const r5 = await mk("Eva", "21:00", 4);
    ok("21:00 reuses a 19:00 table (90 min turn)", r5.json.tableId === r1.json.tableId);

    console.log("\n── Elena chat (rules engine) ──");
    const c1 = await chat("smoke", "Hallo");
    ok("greeting → idle", c1.state === "idle");
    const sid = c1.sessionId;

    const c2 = await chat(sid, "morgen om 18:00 voor 2 personen");
    ok("one-shot slots → collect_name", c2.state === "collect_name",
      `got ${c2.state}`);

    const c3 = await chat(sid, "Fleur Bakker");
    ok("name → collect_phone", c3.state === "collect_phone");

    const c4 = await chat(sid, "0666666666");
    ok("phone → confirm", c4.state === "confirm");

    const c5 = await chat(sid, "ja klopt");
    ok("confirm → done + reservation", c5.state === "done" && c5.reservation !== null);
    ok("chat reservation got a table", c5.reservation?.tableId != null);
    ok("reply mentions table", /tafel/i.test(c5.reply));

    const half = await chat("smoke2", "morgen half 8 voor 2");
    ok('"half 8" → 19:30', half.draft?.time === "19:30", `got ${half.draft?.time}`);

    const price = await chat("smoke3", "Wat kost de schnitzel?");
    ok("menu price answer", /12,50/.test(price.reply));

  } finally {
    server.kill("SIGKILL");
  }

  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => { console.error(err); process.exit(1); });
