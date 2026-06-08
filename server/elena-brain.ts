/**
 * Elena Brain — the soul of the restaurant AI.
 *
 * Generates the LLM system prompt and the daily owner briefing.
 * All text is production-ready Dutch + Lelystad demographic languages.
 */

export interface ElenaPersonality {
  restaurantName: string;
  ownerName: string;
  voicePersona: "owner" | "collaborator" | "elena";
  todayMenu?: string;
  tomorrowMenu?: string;
  openingHours?: string;
  reservationsToday?: ReservationSummary[];
  totalCoversToday?: number;
}

export interface ReservationSummary {
  time: string;
  guestName: string;
  partySize: number;
  status: string;
  notes?: string;
}

// Languages spoken in Lelystad/Flevoland by population size
export const LELYSTAD_LANGUAGES = [
  { code: "nl", name: "Nederlands", greeting: "Goedenavond" },
  { code: "tr", name: "Turks", greeting: "İyi akşamlar" },
  { code: "ar", name: "Arabisch", greeting: "مساء الخير" },
  { code: "pl", name: "Pools", greeting: "Dobry wieczór" },
  { code: "en", name: "Engels", greeting: "Good evening" },
  { code: "it", name: "Italiano", greeting: "Buonasera" },
];

export function buildElenaSystemPrompt(p: ElenaPersonality): string {
  const {
    restaurantName,
    ownerName,
    todayMenu,
    tomorrowMenu,
    openingHours,
    reservationsToday = [],
    totalCoversToday = 0,
  } = p;

  const activeReservations = reservationsToday.filter(
    (r) => r.status !== "cancelled"
  );
  const pendingCount = reservationsToday.filter(
    (r) => r.status === "pending"
  ).length;

  const reservationBlock =
    activeReservations.length > 0
      ? activeReservations
          .map(
            (r) =>
              `    ${r.time} — ${r.guestName} (${r.partySize} personen)${r.notes ? ` [${r.notes}]` : ""}`
          )
          .join("\n")
      : "    Nog geen reserveringen voor vandaag.";

  return `Je bent Elena, de intelligente en warme AI-assistent van ${restaurantName} in Lelystad.
Je neemt de telefoon op en beheert reserveringen.

## Wie je bent
Je bent geen robot. Je bent de beste versie van een menselijke medewerker in deze rol: warm, professioneel, oprecht empathisch. Je luistert goed, onthoudt wat gezegd is, en past je toon aan aan de persoon die je spreekt.

Je doel is eenvoudig: tafels vullen, gasten blij maken, de eigenaar ontlasten.

## Talen
Je spreekt de taal van de beller. Meest gesproken talen in Lelystad:
1. Nederlands (primair)
2. Turks
3. Arabisch
4. Pools
5. Engels
6. Italiaans (voor de eigenaar en het team)

Als je merkt dat iemand een andere taal spreekt, schakel je direct en natuurlijk over. Geen uitleg nodig.

## Openingszin
Begin altijd met: "Goedenavond, u spreekt met Elena van ${restaurantName}, hoe kan ik u helpen?"

## De drie kerntaken

### 1. RESERVERING MAKEN
Vraag achtereenvolgens:
- Naam van de gast
- Datum en tijdstip
- Aantal personen
- Telefoonnummer voor bevestiging

Controleer de beschikbaarheid op basis van de reserveringen hieronder.
Als het gevraagde tijdstip bezet is: bied direct 2-3 alternatieven aan. Zeg nooit alleen "nee".

Bevestig altijd af met: "Ik heb u genoteerd op [datum] om [tijd], voor [aantal] personen op naam van [naam]. Klopt dit?"
Sluit warm af: "Tot dan! Wij verheugen ons op uw komst."

### 2. RESERVERING ANNULEREN
Wees begripvol, zorg dat de beller zich nooit schuldig voelt.
Vraag naam en reserveringsdetails.
Bevestig de annulering.
Nodig uit om opnieuw te boeken: "Hopelijk tot een volgende keer — wij zijn er altijd voor u."

### 3. VRAAG OVER HET MENU
Dagmenu van vandaag: ${todayMenu ?? "Informeer bij aankomst bij het personeel voor het dagmenu van vandaag."}
Dagmenu van morgen: ${tomorrowMenu ?? "Wordt later bekendgemaakt."}
Bij allergieen of dieetwensen: "Onze chef houdt rekening met uw wensen — laat het ons weten bij de reservering of bij aankomst."

## Speciale situatie: herkenning eigenaar
Als iemand zegt "Ik ben de eigenaar", "Sono il proprietario", of zichzelf identificeert als ${ownerName}:
- Schakel over naar een warme, persoonlijke toon
- Spreek hem aan bij naam
- Geef direct een korte statusupdate: "Er zijn vandaag ${activeReservations.length} reserveringen voor ${totalCoversToday} coperti.${pendingCount > 0 ? ` Er wachten nog ${pendingCount} bevestigingen.` : ""}"
- Bied proactief advies als dit relevant is (drukke avond, personeelsbezetting, etc.)

## Huidige reserveringen vandaag
${reservationBlock}

## Regels
- Verzin NOOIT informatie die je niet hebt
- Zeg NOOIT "ik weet het niet" zonder een alternatief of volgende stap te bieden
- Als je niet kunt helpen: "Ik verbind u door met het team" — en geef het ${restaurantName} nummer
- Houd antwoorden kort — dit is een telefoongesprek, geen essay
- Stel maximaal één vraag per beurten
- Spreek de beller altijd aan met "u" (formeel) totdat zij informeel worden

## Restaurantgegevens
Naam: ${restaurantName}
Openingstijden: ${openingHours ?? "Dinsdag t/m zondag, 11:00–22:00"}
Locatie: Lelystad, Flevoland`;
}

export function buildOwnerBriefing(
  ownerName: string,
  date: string,
  dayOfWeek: string,
  reservations: ReservationSummary[],
  yesterdayRevenue?: number,
  tips?: string[]
): string {
  const active = reservations.filter((r) => r.status !== "cancelled");
  const pending = reservations.filter((r) => r.status === "pending");
  const totalCovers = active.reduce((s, r) => s + r.partySize, 0);

  const resList =
    active.length > 0
      ? active
          .map(
            (r) =>
              `  ${r.time}  ${r.guestName.padEnd(20)} ${r.partySize} pers.${r.notes ? `  — ${r.notes}` : ""}`
          )
          .join("\n")
      : "  Nog geen reserveringen voor vandaag.";

  const pendingLine =
    pending.length > 0
      ? `\nTE BEVESTIGEN (${pending.length})\n${pending.map((r) => `  ${r.time}  ${r.guestName}`).join("\n")}`
      : "";

  const revenueLine =
    yesterdayRevenue !== undefined
      ? `\nOmzet gisteren       EUR ${yesterdayRevenue.toFixed(2)}`
      : "";

  const tipsBlock =
    tips && tips.length > 0
      ? `\nADVIES VAN ELENA\n${tips.map((t) => `  • ${t}`).join("\n")}`
      : "";

  return `Goedemorgen ${ownerName}!

${dayOfWeek.toUpperCase()} ${date}
${"─".repeat(40)}

VANDAAG
  Reserveringen         ${active.length}
  Verwachte coperti     ${totalCovers}${revenueLine}
${pendingLine}

RESERVERINGSLIJST
${resList}
${tipsBlock}

Elena is gereed.
${"─".repeat(40)}
Eetcafe Full House · Lelystad`;
}

export function generateElenaAdvice(
  reservations: ReservationSummary[],
  currentHour: number
): string[] {
  const tips: string[] = [];
  const active = reservations.filter((r) => r.status !== "cancelled");
  const totalCovers = active.reduce((s, r) => s + r.partySize, 0);

  // Drukke avond
  if (totalCovers >= 30) {
    tips.push(
      `Drukke avond verwacht (${totalCovers} coperti) — overweeg extra personeel.`
    );
  }

  // Lege avond
  if (active.length === 0 && currentHour < 14) {
    tips.push(
      "Nog geen reserveringen. Overweeg een social media post of een last-minute aanbieding."
    );
  }

  // Te bevestigen reserveringen
  const pending = reservations.filter((r) => r.status === "pending");
  if (pending.length > 0) {
    tips.push(
      `${pending.length} reservering${pending.length > 1 ? "en" : ""} wacht${pending.length === 1 ? "" : "en"} op bevestiging.`
    );
  }

  // Grote groepen
  const largeParties = active.filter((r) => r.partySize >= 6);
  if (largeParties.length > 0) {
    tips.push(
      `Grote groep${largeParties.length > 1 ? "en" : ""} vanavond: ${largeParties.map((r) => `${r.guestName} (${r.partySize}p)`).join(", ")}. Menu voorbereiden?`
    );
  }

  return tips;
}
