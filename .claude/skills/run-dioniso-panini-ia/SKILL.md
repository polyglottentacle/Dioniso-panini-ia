---
name: run-dioniso-panini-ia
description: Run, start, build, screenshot, test, launch the Dioniso Panini IA / Elena restaurant management app. Use when asked to start the server, verify a feature, take a screenshot, or smoke-test the API.
---

# Run — Dioniso Panini IA / Elena

React 18 + Vite (client) + Express + TypeScript (server). Single process serves both the Vite dev middleware and all API routes on **port 5000**.

No database required for local runs — when `DATABASE_URL` is absent or fake, the server falls back to `MemStorage` (in-memory, all Elena features work).

---

## Prerequisites

```bash
# Verified on Ubuntu 24.04 Noble — install once
# Node is at /opt/node22/bin/node (v22.22.2)
# tsx lives in node_modules after npm install

cd /home/user/Dioniso-panini-ia
npm install          # installs node_modules/.bin/tsx and all deps
```

---

## Launch (agent path — no browser needed)

```bash
cd /home/user/Dioniso-panini-ia

DATABASE_URL="postgresql://fake:fake@localhost:5432/fake" \
  node_modules/.bin/tsx server/index.ts &

# Wait for server
sleep 8
curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/
# → 200
```

---

## Smoke test — verified commands

Run these in order after launch:

```bash
# Pages (all return 200)
for path in / /elena /prenota /dashboard; do
  echo -n "$path → "
  curl -s -o /dev/null -w "%{http_code}\n" "http://localhost:5000$path"
done

# Elena brain (system prompt, ~2900 chars)
curl -s http://localhost:5000/api/elena/brain \
  | python3 -c "import sys,json; d=json.load(sys.stdin); print('brain chars:', len(d['prompt']))"

# Elena briefing (stats + tips)
curl -s http://localhost:5000/api/elena/briefing \
  | python3 -c "import sys,json; d=json.load(sys.stdin); print('stats:', d['stats'])"

# POST reservation → read it back
TODAY=$(date +%Y-%m-%d)
curl -s -X POST http://localhost:5000/api/reservations \
  -H "Content-Type: application/json" \
  -d "{\"guestName\":\"Test\",\"guestPhone\":\"+31600\",\"date\":\"$TODAY\",\"time\":\"19:00\",\"partySize\":2,\"notes\":\"\"}" \
  | python3 -c "import sys,json; d=json.load(sys.stdin); print('created id:', d['id'])"

curl -s http://localhost:5000/api/reservations/today \
  | python3 -c "import sys,json; d=json.load(sys.stdin); print('today reservations:', len(d))"
```

Expected output:
```
/ → 200
/elena → 200
/prenota → 200
/dashboard → 200
brain chars: 2916
stats: {'reservationsToday': 0, 'totalCovers': 0, 'pending': 0, 'tips': [...]}
created id: 1
today reservations: 1
```

---

## Stop

```bash
pkill -9 -f "tsx server/index.ts"
```

---

## Real DATABASE_URL (Replit / Neon)

Set in Replit Secrets: `DATABASE_URL=postgresql://...`  
Then run: `npm run dev`  
The storage selector in `server/storage.ts` automatically uses `DatabaseStorage` when a real URL is present.

---

## Gotchas

- **`tsx: not found`** — use `node_modules/.bin/tsx`, not bare `tsx`. The binary is not in PATH by default in this container.
- **Port already in use** — run `pkill -9 -f "tsx server"` before restarting.
- **`chromium-browser` crashes** — installed but requires the snap runtime. Use `curl` to smoke-test instead. Screenshots not possible in this container without downloading a Playwright-bundled browser (blocked by network).
- **API returns 500 with real DATABASE_URL** — normal during local dev. MemStorage fallback activates when URL starts with `postgresql://fake`.
- **`npm run dev` fails** — `tsx` not in PATH globally. Run `node_modules/.bin/tsx server/index.ts` directly, or prefix with `PATH="$PWD/node_modules/.bin:$PATH"`.
- **MemStorage is reset on restart** — in-memory only. Reservations created during a session don't persist.
