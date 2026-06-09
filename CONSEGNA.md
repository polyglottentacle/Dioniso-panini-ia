# Elena — Sistema di gestione per Eetcafé Full House

Regalo per Jan Jansen, Lelystad. Stato: **funzionalità complete**, pronto per
il deploy.

---

## Le pagine

| URL | Per chi | Cosa fa |
|-----|---------|---------|
| `/prenota` | Clienti | Menu completo con card ricche (video, ingredienti, allergeni, recensioni), form di prenotazione, **chat con Elena**, selettore lingua NL/EN/IT/PL |
| `/elena` | Jan / staff | Mappa tavoli interattiva + pannello prenotazioni in tempo reale. Longpress sul logo (o bottone) = Owner Mode |
| `/dagstaat` | Jan | Il foglio giornaliero stile agenda di carta — stampabile, si aggiorna da solo |
| `/qr` | Da stampare | Poster A4 con QR verso `/prenota`, da appendere all'ingresso |
| `/dashboard` | Admin | Statistiche ordini (parte Dioniso originale) |

## Cosa sa fare Elena (chat su /prenota)

- Prenota un tavolo conversando in olandese: capisce "morgen om 19:00 voor 4
  personen", "half acht" (= 19:30!), "met z'n tweeën"
- Risponde su menu, prezzi e allergeni di tutti i 32 piatti reali
- Rifiuta il lunedì (chiuso) e gli orari fuori apertura
- **Assegna il tavolo automaticamente** e lo dice al cliente
  ("U zit aan tafel T6")
- Con `ANTHROPIC_API_KEY` configurata passa a Claude (multilingue completo);
  senza chiave usa il motore a regole — funziona comunque

## La meccanica tavoli (su /elena)

- **Tocca** un tavolo = seleziona · **Doppio tocco** = cambia stato
  (libero → occupato → prenotato)
- **Layout bloccato** di default: i tavoli non si spostano per sbaglio durante
  il servizio. Sblocca con il bottone "Layout" per ridisporli (drag con dito
  o mouse — funziona su iPad)
- **Walk-in**: seleziona un tavolo libero → "Walk-in" → numero persone →
  "Siedi ✓". Crea la prenotazione e occupa il tavolo in 2 secondi
- **Unisci** (2+ tavoli selezionati) e **Dividi** (ripristina la
  configurazione originale)
- Lo stato "Prenotato" sulla mappa **deriva dalle prenotazioni vere**: un
  tavolo con prenotazione nei prossimi 120 minuti diventa blu da solo
- Anti-doppia prenotazione: turno di 90 minuti per tavolo
- Ogni azione è registrata nell'audit log (`GET /api/diana/logs`)

## Come si esegue in locale

```bash
npm install
DATABASE_URL="postgresql://fake:fake@localhost:5432/fake" npm run dev
# → http://localhost:5000  (senza database: MemStorage, dati in memoria)
```

## Test automatici

```bash
npm run smoke    # 29 test: pagine, tavoli, merge, walk-in, assegnazione, chat
npm run check    # TypeScript
```

## Deploy (da fare — serve l'account di Emanuele)

1. **Database**: crea un progetto gratuito su [neon.tech](https://neon.tech),
   copia la connection string
2. Su Replit (o altro host): imposta i Secrets
   - `DATABASE_URL` = la stringa Neon
   - `ANTHROPIC_API_KEY` = opzionale, attiva Elena potenziata da Claude
3. `npm run db:push` (crea le tabelle) poi `npm run start`
4. Stampa il poster da `/qr` e mettilo all'ingresso

## Cose rimaste fuori (in ordine di valore)

1. **I 3 video reali** (funghi, carpaccio, gamberi) — caricali su una GitHub
   Release del repo e aggiungi i `videoUrl` in `shared/menu-data.ts`
   (id `s5`, `s4`, `s3`). Gli altri 11 si generano con i prompt in
   `MEDIA_PROMPTS.md` (Sora)
2. **Vista timeline per turni** — il tavolo è prenotato 19:00–21:00, non
   tutto il giorno; una vista Gantt per tavolo
3. **Guardia multi-dispositivo** — due iPad aperti insieme: aggiungere un
   check su `updatedAt` per evitare sovrascritture silenziose
4. **Telefono** — la visione originale: Elena risponde alla linea fissa di
   Jan (il prompt è già pronto in `GET /api/elena/brain`, serve
   l'integrazione voce: Twilio/Vapi + ElevenLabs)

---

*Powered by Elena · Eetcafé Full House · De Veste 1692, Lelystad*
