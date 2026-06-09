/**
 * Full House menu — real data, real prices.
 * Used server-side for Elena's brain and client-side for the booking page.
 *
 * Rich fields (ingredients, allergens, media, reviews) drive the
 * customer-facing menu cards. Optional — cards degrade gracefully.
 */

export interface Review {
  text: string;        // short positive snippet
  author: string;      // first name + initial
  rating: number;      // 1–5
}

export interface MenuItem {
  id: string;
  name: string;        // Dutch name
  nameIt: string;      // Italian description / translation
  price: number;
  category: "starter" | "main" | "coffee" | "drink" | "wine";
  ingredients?: string[];   // shown as a line under the name
  allergens?: string[];     // EU allergen labels (NL)
  videoUrl?: string;        // TikTok-style 60s loop (mp4/webm), muted
  photoUrl?: string;        // fallback still image
  reviews?: Review[];       // scrolling positive reviews
}

export const FULL_HOUSE_MENU: MenuItem[] = [
  // ── Starters ──────────────────────────────────────────────────────────────
  {
    id: "s1", name: "Mandje Stokbrood",
    nameIt: "Cestino di baguette con burro alle erbe e aioli",
    price: 3.50, category: "starter",
    ingredients: ["Stokbrood", "Kruidenboter", "Aioli"],
    allergens: ["Gluten", "Ei", "Melk"],
    reviews: [
      { text: "Vers brood, heerlijke aioli!", author: "Sanne K.", rating: 5 },
      { text: "Perfect om mee te beginnen.", author: "Mehmet A.", rating: 5 },
    ],
  },
  {
    id: "s2", name: "Tomatensoep",
    nameIt: "Zuppa di pomodoro con basilico e polpettine",
    price: 4.00, category: "starter",
    ingredients: ["Tomaat", "Basilicum", "Gehaktballetjes"],
    allergens: ["Selderij"],
    reviews: [
      { text: "Echt zelfgemaakt, je proeft het.", author: "Anna V.", rating: 5 },
      { text: "Lekker romig en warm.", author: "Piotr W.", rating: 4 },
    ],
  },
  {
    id: "s3", name: "Gamba's á la Jan",
    nameIt: "Gamberi alla Jan — il grande classico della casa",
    price: 9.00, category: "starter",
    ingredients: ["Gamba's", "Knoflook", "Witte wijn", "Peterselie"],
    allergens: ["Schaaldieren", "Sulfiet"],
    reviews: [
      { text: "De beste gamba's van Lelystad!", author: "Fatima E.", rating: 5 },
      { text: "Het signatuurgerecht van Jan. Top.", author: "Henk D.", rating: 5 },
      { text: "Knoflook precies goed.", author: "Lucía M.", rating: 5 },
    ],
  },
  {
    id: "s4", name: "Plat geslagen Rund",
    nameIt: "Carpaccio di manzo con pesto, pinoli e parmigiano",
    price: 9.00, category: "starter",
    ingredients: ["Rundvlees", "Pesto", "Pijnboompitten", "Parmezaan"],
    allergens: ["Noten", "Melk"],
    reviews: [
      { text: "Dun gesneden, smelt op je tong.", author: "Rob J.", rating: 5 },
      { text: "Mooie presentatie.", author: "Eva S.", rating: 4 },
    ],
  },
  {
    id: "s5", name: "Funghi \"Full House\"",
    nameIt: "Funghi saltati con erbe, aglio e vino bianco",
    price: 8.50, category: "starter",
    ingredients: ["Champignons", "Knoflook", "Witte wijn", "Kruiden"],
    allergens: ["Sulfiet"],
    reviews: [
      { text: "Vegetarisch en super smaakvol.", author: "Nadia B.", rating: 5 },
      { text: "Knoflookliefhebbers opgelet!", author: "Tom V.", rating: 5 },
    ],
  },
  {
    id: "s6", name: "Volendammer Paling",
    nameIt: "Filetti di anguilla tipica con toast e burro",
    price: 9.00, category: "starter",
    ingredients: ["Gerookte paling", "Toast", "Boter"],
    allergens: ["Vis", "Gluten", "Melk"],
    reviews: [
      { text: "Echte Hollandse traktatie.", author: "Wim K.", rating: 5 },
      { text: "Vers en niet te zout.", author: "Greta H.", rating: 4 },
    ],
  },
  {
    id: "s7", name: "Het 'Slakkengangetje'",
    nameIt: "Lumache avvolte nel bacon, saltate al burro alle erbe",
    price: 9.00, category: "starter",
    ingredients: ["Slakken", "Spek", "Kruidenboter"],
    allergens: ["Weekdieren", "Melk"],
    reviews: [
      { text: "Durfde het aan — geen spijt!", author: "Joris P.", rating: 5 },
      { text: "Bijzonder en lekker.", author: "Karim Z.", rating: 4 },
    ],
  },

  // ── Mains ─────────────────────────────────────────────────────────────────
  {
    id: "m1", name: "Schnitzel",
    nameIt: "Cotoletta classica",
    price: 12.50, category: "main",
    ingredients: ["Varkensschnitzel", "Friet", "Salade"],
    allergens: ["Gluten", "Ei"],
    reviews: [
      { text: "Groot en krokant. Echt vullend.", author: "Dirk M.", rating: 5 },
      { text: "Kinderen waren dol op de friet.", author: "Linda R.", rating: 5 },
    ],
  },
  {
    id: "m2", name: "Lekker zonnig",
    nameIt: "Schnitzel con formaggio e ananas",
    price: 13.50, category: "main",
    ingredients: ["Schnitzel", "Kaas", "Ananas"],
    allergens: ["Gluten", "Melk", "Ei"],
    reviews: [
      { text: "Zoet en hartig, verrassend goed.", author: "Bram T.", rating: 4 },
      { text: "Mijn vaste keuze hier.", author: "Yasmin O.", rating: 5 },
    ],
  },
  {
    id: "m3", name: "Smulfestijn",
    nameIt: "Spareribs cotti nella salsa alla soia",
    price: 15.00, category: "main",
    ingredients: ["Spareribs", "Sojasaus", "Honing", "Friet"],
    allergens: ["Soja", "Sesam"],
    reviews: [
      { text: "Vlees valt van het bot!", author: "Erik N.", rating: 5 },
      { text: "Grote portie, kom hongerig.", author: "Sofia G.", rating: 5 },
      { text: "Beste ribs in de buurt.", author: "Hassan L.", rating: 5 },
    ],
  },
  {
    id: "m4", name: "Wokkie-Wokkie",
    nameIt: "Verdure e pollo saltati nel wok",
    price: 14.00, category: "main",
    ingredients: ["Kip", "Wokgroenten", "Sojasaus"],
    allergens: ["Soja", "Sesam"],
    reviews: [
      { text: "Lekker fris en gezond.", author: "Maria D.", rating: 4 },
      { text: "Groenten knapperig, kip mals.", author: "Kees B.", rating: 5 },
    ],
  },
  {
    id: "m5", name: "Zwijntje van \"Full House\"",
    nameIt: "Filetti di maiale avvolti in pancetta",
    price: 16.50, category: "main",
    ingredients: ["Varkenshaas", "Spek", "Aardappel", "Groenten"],
    allergens: [],
    reviews: [
      { text: "Sappig en vol smaak.", author: "Ralph V.", rating: 5 },
      { text: "Het spek maakt het af.", author: "Ingrid S.", rating: 5 },
    ],
  },
  {
    id: "m6", name: "Mijn naam is Haas",
    nameIt: "Due medaglioni di maiale con brie e gorgonzola",
    price: 17.00, category: "main",
    ingredients: ["Varkenshaas", "Brie", "Gorgonzolasaus"],
    allergens: ["Melk"],
    reviews: [
      { text: "Brie en gorgonzola — hemels.", author: "Daan K.", rating: 5 },
      { text: "Verfijnd voor een eetcafé.", author: "Petra M.", rating: 5 },
    ],
  },
  {
    id: "m7", name: "Diamanthaasje",
    nameIt: "Taglio pregiato di manzo ~220g",
    price: 16.00, category: "main",
    ingredients: ["Diamanthaas 220g", "Friet", "Salade", "Saus naar keuze"],
    allergens: [],
    reviews: [
      { text: "Mooi rosé gebakken, top kwaliteit.", author: "Stefan W.", rating: 5 },
      { text: "Mals als boter.", author: "Aylin C.", rating: 5 },
      { text: "Mijn favoriet van de kaart.", author: "Marco F.", rating: 5 },
    ],
  },

  // ── Coffee & spirits ────────────────────────────────────────────────────────
  { id: "c1", name: "Koffie", nameIt: "Caffè filtro olandese", price: 2.10, category: "coffee" },
  { id: "c2", name: "Espresso", nameIt: "Espresso", price: 1.90, category: "coffee" },
  { id: "c3", name: "Cappuccino", nameIt: "Cappuccino", price: 2.30, category: "coffee", allergens: ["Melk"] },
  { id: "c4", name: "Latte Macchiato", nameIt: "Latte Macchiato", price: 2.50, category: "coffee", allergens: ["Melk"] },
  { id: "c5", name: "Irish coffee", nameIt: "Irish whisky con caffè", price: 6.50, category: "coffee", allergens: ["Melk"] },
  { id: "c6", name: "Spanish coffee", nameIt: "Tia Maria o Licor 43 con caffè", price: 6.50, category: "coffee", allergens: ["Melk"] },
  { id: "c7", name: "Dokkumer koffie", nameIt: "Berenburg (amaro olandese) con caffè", price: 6.00, category: "coffee", allergens: ["Melk"] },

  // ── Drinks ──────────────────────────────────────────────────────────────────
  { id: "d1", name: "Coca Cola / Zero", nameIt: "Coca Cola", price: 2.80, category: "drink" },
  { id: "d2", name: "Fanta Orange / Cassis", nameIt: "Fanta", price: 2.80, category: "drink" },
  { id: "d3", name: "Lipton Ice Tea", nameIt: "Ice Tea", price: 3.00, category: "drink" },
  { id: "d4", name: "Appelsap", nameIt: "Succo di mela", price: 2.80, category: "drink" },
  { id: "d5", name: "Fristi / Chocomel", nameIt: "Bibite per bambini", price: 3.00, category: "drink", allergens: ["Melk"] },
  { id: "d6", name: "Tapbier Fluitje", nameIt: "Birra piccola alla spina", price: 3.00, category: "drink", allergens: ["Gluten"] },
  { id: "d7", name: "Tapbier Vaasje", nameIt: "Birra media alla spina", price: 3.50, category: "drink", allergens: ["Gluten"] },

  // ── Wine ────────────────────────────────────────────────────────────────────
  { id: "w1", name: "Huiswijn Rood (glas)", nameIt: "Vino rosso della casa", price: 4.50, category: "wine", allergens: ["Sulfiet"] },
  { id: "w2", name: "Huiswijn Wit - Droog (glas)", nameIt: "Vino bianco secco", price: 4.50, category: "wine", allergens: ["Sulfiet"] },
  { id: "w3", name: "Huiswijn Wit - Zoet (glas)", nameIt: "Vino bianco dolce", price: 4.50, category: "wine", allergens: ["Sulfiet"] },
  { id: "w4", name: "Rosé (glas)", nameIt: "Rosé", price: 4.50, category: "wine", allergens: ["Sulfiet"] },
];

export const CATEGORY_LABELS: Record<MenuItem["category"], { nl: string; it: string }> = {
  starter: { nl: "Voorgerechten", it: "Antipasti" },
  main:    { nl: "Hoofdgerechten", it: "Piatti Principali" },
  coffee:  { nl: "Koffie Specialiteiten", it: "Caffè" },
  drink:   { nl: "Frisdranken & Bieren", it: "Bibite & Birre" },
  wine:    { nl: "Wijnen", it: "Vini" },
};

export const CATEGORY_ORDER: MenuItem["category"][] = [
  "starter", "main", "coffee", "drink", "wine",
];
