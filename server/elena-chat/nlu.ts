// Dutch Natural Language Understanding: date, time, party, phone, intent

const NL_MONTHS: Record<string, number> = {
  januari: 1, februari: 2, maart: 3, april: 4, mei: 5, juni: 6,
  juli: 7, augustus: 8, september: 9, oktober: 10, november: 11, december: 12,
  jan: 1, feb: 2, mrt: 3, apr: 4, jun: 6, jul: 7, aug: 8, sep: 9, okt: 10, nov: 11, dec: 12,
};

const NL_WEEKDAYS: Record<string, number> = {
  maandag: 1, dinsdag: 2, woensdag: 3, donderdag: 4, vrijdag: 5, zaterdag: 6, zondag: 0,
  ma: 1, di: 2, wo: 3, do: 4, vr: 5, za: 6, zo: 0,
};

const NL_NUMBERS: Record<string, number> = {
  een: 1, één: 1, twee: 2, drie: 3, vier: 4, vijf: 5,
  zes: 6, zeven: 7, acht: 8, negen: 9, tien: 10, elf: 11, twaalf: 12,
};

function normalize(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();
}

function nextWeekday(dayOfWeek: number, base: Date): Date {
  const d = new Date(base);
  const diff = (dayOfWeek - d.getDay() + 7) % 7;
  d.setDate(d.getDate() + (diff === 0 ? 0 : diff));
  return d;
}

function toISO(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function parseDate(input: string): string | null {
  const s = normalize(input);
  const today = new Date();

  if (/\bvandaag\b/.test(s)) return toISO(today);
  if (/\bmorgen\b/.test(s)) { const d = new Date(today); d.setDate(d.getDate() + 1); return toISO(d); }
  if (/\bovermorgen\b/.test(s)) { const d = new Date(today); d.setDate(d.getDate() + 2); return toISO(d); }

  // "volgende week <dag>"
  const nextWeekMatch = s.match(/volgende\s+week\s+(\w+)/);
  if (nextWeekMatch) {
    const day = NL_WEEKDAYS[nextWeekMatch[1]];
    if (day !== undefined) {
      const d = nextWeekday(day, today);
      d.setDate(d.getDate() + (d <= today ? 7 : 0));
      return toISO(d);
    }
  }

  // bare weekday or "aanstaande <dag>"
  const weekdayMatch = s.match(/(?:aanstaande|as\.)?\s*\b(maandag|dinsdag|woensdag|donderdag|vrijdag|zaterdag|zondag|ma|di|wo|do|vr|za|zo)\b/);
  if (weekdayMatch) {
    const day = NL_WEEKDAYS[weekdayMatch[1]];
    if (day !== undefined) return toISO(nextWeekday(day, today));
  }

  // "13 juni" or "13 juni 2026"
  const nlDateMatch = s.match(/\b(\d{1,2})\s+([a-z]+)(?:\s+(\d{4}))?\b/);
  if (nlDateMatch) {
    const day = parseInt(nlDateMatch[1], 10);
    const month = NL_MONTHS[nlDateMatch[2]];
    const year = nlDateMatch[3] ? parseInt(nlDateMatch[3], 10) : today.getFullYear();
    if (month && day >= 1 && day <= 31) {
      const d = new Date(year, month - 1, day);
      if (!isNaN(d.getTime())) return toISO(d);
    }
  }

  // numeric: 13-06-2026 or 13/6 or 13-06
  const numDateMatch = s.match(/\b(\d{1,2})[-\/](\d{1,2})(?:[-\/](\d{4}))?\b/);
  if (numDateMatch) {
    const day = parseInt(numDateMatch[1], 10);
    const month = parseInt(numDateMatch[2], 10);
    const year = numDateMatch[3] ? parseInt(numDateMatch[3], 10) : today.getFullYear();
    if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
      const d = new Date(year, month - 1, day);
      if (!isNaN(d.getTime())) return toISO(d);
    }
  }

  // ISO
  const isoMatch = s.match(/\b(\d{4})-(\d{2})-(\d{2})\b/);
  if (isoMatch) return isoMatch[0];

  return null;
}

export function parseTime(input: string): string | null {
  const s = normalize(input);

  // "half acht" → 19:30 (Dutch "half 8" = 7:30, dinner bias → 19:30)
  const halfMatch = s.match(/half\s+([a-z]+|\d+)/);
  if (halfMatch) {
    const numWord = halfMatch[1];
    const hour = parseInt(numWord, 10) || NL_NUMBERS[numWord];
    if (hour) {
      const evening = hour <= 10 ? hour + 12 : hour;
      return `${String(evening - 1).padStart(2, "0")}:30`;
    }
  }

  // "kwart over 7" → 19:15
  const kwartOverMatch = s.match(/kwart\s+over\s+([a-z]+|\d+)/);
  if (kwartOverMatch) {
    const h = parseInt(kwartOverMatch[1], 10) || NL_NUMBERS[kwartOverMatch[1]];
    if (h) { const ev = h <= 10 ? h + 12 : h; return `${String(ev).padStart(2, "0")}:15`; }
  }

  // "kwart voor 8" → 19:45
  const kwartVoorMatch = s.match(/kwart\s+voor\s+([a-z]+|\d+)/);
  if (kwartVoorMatch) {
    const h = parseInt(kwartVoorMatch[1], 10) || NL_NUMBERS[kwartVoorMatch[1]];
    if (h) { const ev = h <= 10 ? h + 12 : h; return `${String(ev - 1).padStart(2, "0")}:45`; }
  }

  // "'s avonds om 7" / "'s middags om 1"
  const avondsMatch = s.match(/'?s\s+avonds\s+(?:om\s+)?(\d+)/);
  if (avondsMatch) { const h = parseInt(avondsMatch[1], 10); return `${String(h < 12 ? h + 12 : h).padStart(2, "0")}:00`; }
  const middagsMatch = s.match(/'?s\s+middags\s+(?:om\s+)?(\d+)/);
  if (middagsMatch) { const h = parseInt(middagsMatch[1], 10); return `${String(h < 12 ? h + 12 : h).padStart(2, "0")}:00`; }

  // "19:00" / "19.00" / "19u" / "om 19" / "19 uur"
  const exactMatch = s.match(/\b(\d{1,2})[:.h](\d{2})\b/);
  if (exactMatch) {
    const h = parseInt(exactMatch[1], 10);
    const m = parseInt(exactMatch[2], 10);
    if (h >= 0 && h <= 23 && m >= 0 && m <= 59) return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  }

  // "om 7 uur" / "19 uur" / "om 19"
  const urenMatch = s.match(/(?:om\s+)?(\d{1,2})\s*(?:uur|u)\b/);
  if (urenMatch) {
    const h = parseInt(urenMatch[1], 10);
    const ev = h <= 10 ? h + 12 : h;
    return `${String(ev).padStart(2, "0")}:00`;
  }

  // bare "om 7"
  const omMatch = s.match(/\bom\s+(\d{1,2})\b/);
  if (omMatch) {
    const h = parseInt(omMatch[1], 10);
    const ev = h <= 10 ? h + 12 : h;
    return `${String(ev).padStart(2, "0")}:00`;
  }

  return null;
}

export function parsePartySize(input: string, consumed: Set<string>): number | null {
  const s = normalize(input);

  // "met z'n tweeen/drieen/..."
  const metMatch = s.match(/met\s+z['']?n\s+(tweeen|drieen|vieren|vijven|zessen|zevenen|achten|negenen|tienen)/);
  if (metMatch) {
    const map: Record<string, number> = { tweeen: 2, drieen: 3, vieren: 4, vijven: 5, zessen: 6, zevenen: 7, achten: 8, negenen: 9, tienen: 10 };
    return map[metMatch[1]] ?? null;
  }

  // "4 personen" / "voor 4" / "met 4 man" / "4 gasten"
  const ctxMatch = s.match(/(?:voor|met|van|)\s*(\d+)\s*(?:personen?|man|gasten?|mensen?|pax)/);
  if (ctxMatch) return parseInt(ctxMatch[1], 10);

  // number word
  for (const [word, num] of Object.entries(NL_NUMBERS)) {
    if (new RegExp(`\\b${word}\\b`).test(s)) return num;
  }

  // bare digit, only if not already used for time/date
  const bareMatch = s.match(/\b(\d{1,2})\b/);
  if (bareMatch && !consumed.has(bareMatch[1])) {
    const n = parseInt(bareMatch[1], 10);
    if (n >= 1 && n <= 20) return n;
  }

  return null;
}

export function parsePhone(input: string): string | null {
  const digits = input.replace(/[\s\-().+]/g, "").replace(/^0031/, "0").replace(/^\+31/, "0");
  if (/^0\d{9}$/.test(digits)) return digits;
  if (/^\d{9,10}$/.test(digits)) return digits;
  return null;
}

export type Intent = "book" | "menu" | "hours" | "cancel" | "other";

export function detectIntent(input: string): Intent {
  const s = normalize(input);
  if (/reserveer|reserveren|reservering|tafel|boeken|plek|plaats|tafelj/.test(s)) return "book";
  if (/menu|kaart|eten|gerecht|prijs|kost|allerg|vegetar|wijn|bier|koffie|voorgerecht|hoofdgerecht|schnitzel|gamba|rib|funghi|carpaccio|wokk|schnitzel|haas|diamant|paling|slakken/.test(s)) return "menu";
  if (/open|openingstijden|gesloten|hoe laat|wanneer|dicht|sluit/.test(s)) return "hours";
  if (/annuleer|annuleren|afzeg|cancel/.test(s)) return "cancel";
  return "other";
}

export function isClosed(dateISO: string): boolean {
  const d = new Date(dateISO);
  return d.getDay() === 1; // Monday
}

export function isPast(dateISO: string, timeHHMM?: string): boolean {
  const now = new Date();
  const [y, m, day] = dateISO.split("-").map(Number);
  if (!timeHHMM) {
    // Date-only check: compare calendar dates, today is never in the past
    const todayISO = toISO(now);
    return dateISO < todayISO;
  }
  const [h, min] = timeHHMM.split(":").map(Number);
  const dt = new Date(y, m - 1, day, h, min);
  return dt < now;
}

export function isValidTime(timeHHMM: string): boolean {
  const [h, m] = timeHHMM.split(":").map(Number);
  const total = h * 60 + m;
  return total >= 11 * 60 && total <= 21 * 60 + 30;
}

export function formatDateNL(dateISO: string): string {
  const d = new Date(dateISO + "T12:00:00");
  return d.toLocaleDateString("nl-NL", { weekday: "long", day: "numeric", month: "long" });
}

export function isYes(s: string): boolean {
  return /\b(ja|yes|klopt|prima|correct|is goed|akkoord|ok|oke|jep|jup|goed)\b/.test(normalize(s));
}

export function isNo(s: string): boolean {
  return /\b(nee|niet|fout|verander|wijzig|anders|no)\b/.test(normalize(s));
}
