import { FULL_HOUSE_MENU, CATEGORY_LABELS } from "../../shared/menu-data";

function norm(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();
}

function priceNL(p: number): string {
  return `€ ${p.toFixed(2).replace(".", ",")}`;
}

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  starter: ["voorgerecht", "vooraf", "starter", "antipast", "stokbrood", "soep", "carpaccio"],
  main: ["hoofdgerecht", "hoofd", "main", "pasta", "piatto"],
  coffee: ["koffie", "coffee", "cappuccino", "espresso", "irish"],
  drink: ["drank", "fris", "frisdrank", "bier", "cola", "fanta", "lipton", "appelsap"],
  wine: ["wijn", "wine", "rose", "rosé", "wit", "rood"],
};

// Normalized item name index for fast lookup
const itemIndex = FULL_HOUSE_MENU.map((item) => ({
  item,
  tokens: norm(item.name + " " + item.nameIt).split(/\s+/),
}));

export function answerMenuQuestion(question: string): string | null {
  const q = norm(question);

  // Check if it's menu-related at all
  const isMenuQuestion =
    /menu|kaart|eten|gerecht|prijs|kost|allerg|wijn|bier|koffie|voorgerecht|hoofdgerecht/.test(q) ||
    FULL_HOUSE_MENU.some((item) => norm(item.name).split(/\s+/).some((t) => t.length > 3 && q.includes(t)));

  if (!isMenuQuestion) return null;

  // Specific item match
  const matched = FULL_HOUSE_MENU.find((item) =>
    norm(item.name).split(/\s+/).some((t) => t.length > 3 && q.includes(t))
  );

  if (matched) {
    const allergenStr =
      matched.allergens && matched.allergens.length > 0
        ? matched.allergens.join(", ")
        : "geen";
    const ingStr =
      matched.ingredients && matched.ingredients.length > 0
        ? ` (${matched.ingredients.join(", ")})`
        : "";
    const allergFocus = /allerg/.test(q);
    if (allergFocus) {
      return `**${matched.name}** — allergenen: ${allergenStr}.${ingStr !== "" ? ` Ingrediënten:${ingStr}.` : ""}`;
    }
    return `**${matched.name}** kost ${priceNL(matched.price)}${ingStr}. Allergenen: ${allergenStr}.`;
  }

  // Category match
  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((kw) => q.includes(kw))) {
      const items = FULL_HOUSE_MENU.filter((i) => i.category === cat).slice(0, 5);
      const label = CATEGORY_LABELS[cat as keyof typeof CATEGORY_LABELS]?.nl ?? cat;
      const list = items.map((i) => `${i.name} (${priceNL(i.price)})`).join(", ");
      return `Onze **${label.toLowerCase()}**: ${list}${FULL_HOUSE_MENU.filter((i) => i.category === cat).length > 5 ? " en meer" : ""}. Bekijk alles op /prenota.`;
    }
  }

  // Generic fallback with signature picks
  return `Op onze kaart: voorgerechten, hoofdgerechten, koffie, dranken en wijnen.\nSignatuurgerechten: Gamba's á la Jan ${priceNL(9)} en Smulfestijn (spareribs) ${priceNL(15)}. Naar wat bent u op zoek?`;
}

export function answerHoursQuestion(): string {
  return "Wij zijn **dinsdag t/m zondag open van 11:00 tot 22:00**. Op maandag zijn wij gesloten. Adres: De Veste 1692, Lelystad. Tel: +31 320 282 428.";
}
