/**
 * Full House menu — real data, real prices.
 * Used server-side for Elena's brain and client-side for the booking page.
 */

export interface MenuItem {
  id: string;
  name: string;
  nameIt: string;
  price: number;
  category: "starter" | "main" | "coffee" | "drink" | "wine";
}

export const FULL_HOUSE_MENU: MenuItem[] = [
  // Starters
  { id: "s1", name: "Mandje Stokbrood", nameIt: "Cestino di baguette con burro alle erbe e aioli", price: 3.50, category: "starter" },
  { id: "s2", name: "Tomatensoep", nameIt: "Zuppa di pomodoro con basilico e polpettine", price: 4.00, category: "starter" },
  { id: "s3", name: "Gamba's á la Jan", nameIt: "Gamberi alla Jan — il grande classico della casa", price: 9.00, category: "starter" },
  { id: "s4", name: "Plat geslagen Rund", nameIt: "Carpaccio di manzo con pesto, pinoli e parmigiano", price: 9.00, category: "starter" },
  { id: "s5", name: "Funghi \"Full House\"", nameIt: "Funghi saltati con erbe, aglio e vino bianco", price: 8.50, category: "starter" },
  { id: "s6", name: "Volendammer Paling", nameIt: "Filetti di anguilla tipica con toast e burro", price: 9.00, category: "starter" },
  { id: "s7", name: "Het 'Slakkengangetje'", nameIt: "Lumache nel bacon, saltate al burro alle erbe", price: 9.00, category: "starter" },

  // Mains
  { id: "m1", name: "Schnitzel", nameIt: "Cotoletta classica", price: 12.50, category: "main" },
  { id: "m2", name: "Lekker zonnig", nameIt: "Schnitzel con formaggio e ananas", price: 13.50, category: "main" },
  { id: "m3", name: "Smulfestijn", nameIt: "Spareribs cotti nella salsa alla soia", price: 15.00, category: "main" },
  { id: "m4", name: "Wokkie-Wokkie", nameIt: "Verdure e pollo saltati nel wok", price: 14.00, category: "main" },
  { id: "m5", name: "Zwijntje van \"Full House\"", nameIt: "Filetti di maiale avvolti in pancetta", price: 16.50, category: "main" },
  { id: "m6", name: "Mijn naam is Haas", nameIt: "Due medaglioni di maiale con brie e gorgonzola", price: 17.00, category: "main" },
  { id: "m7", name: "Diamanthaasje", nameIt: "Taglio pregiato di manzo ~220g", price: 16.00, category: "main" },

  // Coffee & spirits
  { id: "c1", name: "Koffie", nameIt: "Caffè filtro olandese", price: 2.10, category: "coffee" },
  { id: "c2", name: "Espresso", nameIt: "Espresso", price: 1.90, category: "coffee" },
  { id: "c3", name: "Cappuccino", nameIt: "Cappuccino", price: 2.30, category: "coffee" },
  { id: "c4", name: "Latte Macchiato", nameIt: "Latte Macchiato", price: 2.50, category: "coffee" },
  { id: "c5", name: "Irish coffee", nameIt: "Irish whisky con caffè", price: 6.50, category: "coffee" },
  { id: "c6", name: "Spanish coffee", nameIt: "Tia Maria o Licor 43 con caffè", price: 6.50, category: "coffee" },
  { id: "c7", name: "Dokkumer koffie", nameIt: "Berenburg (amaro olandese) con caffè", price: 6.00, category: "coffee" },

  // Drinks
  { id: "d1", name: "Coca Cola / Zero", nameIt: "Coca Cola", price: 2.80, category: "drink" },
  { id: "d2", name: "Fanta Orange / Cassis", nameIt: "Fanta", price: 2.80, category: "drink" },
  { id: "d3", name: "Lipton Ice Tea", nameIt: "Ice Tea", price: 3.00, category: "drink" },
  { id: "d4", name: "Appelsap", nameIt: "Succo di mela", price: 2.80, category: "drink" },
  { id: "d5", name: "Fristi / Chocomel", nameIt: "Bibite per bambini", price: 3.00, category: "drink" },
  { id: "d6", name: "Tapbier Fluitje", nameIt: "Birra piccola alla spina", price: 3.00, category: "drink" },
  { id: "d7", name: "Tapbier Vaasje", nameIt: "Birra media alla spina", price: 3.50, category: "drink" },

  // Wine
  { id: "w1", name: "Huiswijn Rood (glas)", nameIt: "Vino rosso della casa", price: 4.50, category: "wine" },
  { id: "w2", name: "Huiswijn Wit - Droog (glas)", nameIt: "Vino bianco secco", price: 4.50, category: "wine" },
  { id: "w3", name: "Huiswijn Wit - Zoet (glas)", nameIt: "Vino bianco dolce", price: 4.50, category: "wine" },
  { id: "w4", name: "Rosé (glas)", nameIt: "Rosé", price: 4.50, category: "wine" },
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
