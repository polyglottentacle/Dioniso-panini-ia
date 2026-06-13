/**
 * Full House menu — real data, real prices from the physical menu.
 * Used server-side for Elena's brain and client-side for the booking page.
 */

export interface Review {
  text: string;
  author: string;
  rating: number;
}

export interface MenuItem {
  id: string;
  name: string;        // Dutch name
  nameIt: string;      // Italian description / translation
  price: number;
  category: "starter" | "main" | "fish" | "dessert" | "kids" | "coffee" | "drink" | "wine";
  ingredients?: string[];
  allergens?: string[];
  videoUrl?: string;
  photoUrl?: string;
  reviews?: Review[];
}

export const FULL_HOUSE_MENU: MenuItem[] = [

  // ── Voorgerechten / Starters ───────────────────────────────────────────────
  {
    id: "s0", name: "Kalfstatar",
    nameIt: "Tartare di vitello tagliata fine con maionese tartara della casa",
    price: 9.00, category: "starter",
    ingredients: ["Kalfstatar", "Huisgemaakte tartijmayonaise"],
    allergens: ["Ei", "Mosterd"],
    reviews: [
      { text: "Fijn gesneden, heerlijke tartijmayonaise.", author: "Ben S.", rating: 5 },
    ],
  },
  {
    id: "s00", name: "Gebakken Camembert",
    nameIt: "Camembert fritto con salsa ai mirtilli rossi",
    price: 8.00, category: "starter",
    ingredients: ["Camembert", "Cranberrysaus"],
    allergens: ["Melk", "Gluten"],
    reviews: [
      { text: "Warm en smeltend, de cranberry is perfect erbij.", author: "Lien V.", rating: 5 },
    ],
  },
  {
    id: "s01", name: "Het Provertje",
    nameIt: "Tapasselection van verschillende voorgerechten — per chi vuole assaggiare tutto",
    price: 12.00, category: "starter",
    ingredients: ["Wisselende tapas van de kaart"],
    allergens: ["Melk", "Gluten", "Ei"],
    reviews: [
      { text: "Perfecte manier om alles te proeven!", author: "Ria K.", rating: 5 },
    ],
  },
  {
    id: "s02", name: "Tour du France",
    nameIt: "Zuppa di lenticchie della casa — ricetta francese della nonna",
    price: 5.00, category: "starter",
    ingredients: ["Linzen", "Groenten", "Oud Frans recept"],
    allergens: ["Selderij"],
    reviews: [
      { text: "Dagelijkse soep, altijd anders, altijd lekker.", author: "Joop M.", rating: 4 },
    ],
  },
  {
    id: "s03", name: "Het Zonnetje",
    nameIt: "Melone fresco con fragole — leggero e rinfrescante",
    price: 7.50, category: "starter",
    ingredients: ["Meloen", "Aardbei"],
    allergens: [],
    reviews: [
      { text: "Fris en licht, ideaal begin.", author: "Yvonne P.", rating: 4 },
    ],
  },
  {
    id: "s04", name: "Gerookte Ribeye Carpaccio",
    nameIt: "Carpaccio di ribeye affumicata con pinoli e maionese al tartufo",
    price: 10.50, category: "starter",
    ingredients: ["Gerookte ribeye", "Pijnboompitten", "Truffelmayonaise"],
    allergens: ["Ei", "Mosterd", "Noten"],
    reviews: [
      { text: "De truffelmayonaise maakt het bijzonder.", author: "Fred A.", rating: 5 },
    ],
  },
  {
    id: "s05", name: "Gerookte Zalm",
    nameIt: "Salmone affumicato tagliato fine con toast e burro",
    price: 12.00, category: "starter",
    ingredients: ["Gerookte zalm", "Toast", "Boter"],
    allergens: ["Vis", "Gluten", "Melk"],
    reviews: [
      { text: "Verse zalm, perfecte combinatie met toast.", author: "Corien T.", rating: 5 },
    ],
  },
  {
    id: "s06", name: "Krabcocktail",
    nameIt: "Cocktail di granchio — il nostro twist sulla classica",
    price: 12.00, category: "starter",
    ingredients: ["Krab", "Cocktailsaus", "IJsberg"],
    allergens: ["Schaaldieren", "Ei"],
    reviews: [
      { text: "Niet de echte — maar smaakt als de echte!", author: "Henny B.", rating: 4 },
    ],
  },
  {
    id: "s07", name: "Zuiderzee Salade",
    nameIt: "Insalata del Zuiderzee — combinazione dei migliori antipasti di mare",
    price: 13.00, category: "starter",
    ingredients: ["Gerookte zalm", "Krab", "Paling", "Salade"],
    allergens: ["Vis", "Schaaldieren", "Melk", "Gluten"],
    reviews: [
      { text: "Een combinatie van alles — geweldig!", author: "Tineke R.", rating: 5 },
    ],
  },
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
    videoUrl: "/videos/gamberi_full_house.mp4",
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
    videoUrl: "/videos/carpaccio_full_house.mp4",
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
    videoUrl: "/videos/funghi_full_house.mp4",
    reviews: [
      { text: "Vegetarisch en super smaakvol.", author: "Nadia B.", rating: 5 },
      { text: "Knoflookliefhebbers opgelet!", author: "Tom V.", rating: 5 },
    ],
  },
  {
    id: "s6", name: "Volendammer Paling",
    nameIt: "Filetti di anguilla tipica con toast e burro",
    price: 10.50, category: "starter",
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

  // ── Hoofdgerechten — Vlees / Meat mains ───────────────────────────────────
  {
    id: "m1", name: "Schnitzel",
    nameIt: "Cotoletta classica impanata",
    price: 21.00, category: "main",
    ingredients: ["Varkensschnitzel", "Friet", "Salade", "Groenten"],
    allergens: ["Gluten", "Ei"],
    reviews: [
      { text: "Groot en krokant. Echt vullend.", author: "Dirk M.", rating: 5 },
      { text: "Kinderen waren dol op de friet.", author: "Linda R.", rating: 5 },
    ],
  },
  {
    id: "m2", name: "Lekker Zonnig",
    nameIt: "Schnitzel con formaggio e ananas gratinati",
    price: 20.00, category: "main",
    ingredients: ["Schnitzel", "Kaas", "Ananas", "Friet", "Groenten"],
    allergens: ["Gluten", "Melk", "Ei"],
    reviews: [
      { text: "Zoet en hartig, verrassend goed.", author: "Bram T.", rating: 4 },
      { text: "Mijn vaste keuze hier.", author: "Yasmin O.", rating: 5 },
    ],
  },
  {
    id: "m3", name: "Smulfestijn",
    nameIt: "Spareribs cotti lentamente nella salsa teriyaki",
    price: 20.50, category: "main",
    ingredients: ["Spareribs", "Ketjapsaus", "Honing", "Friet", "Groenten"],
    allergens: ["Soja", "Sesam"],
    reviews: [
      { text: "Vlees valt van het bot!", author: "Erik N.", rating: 5 },
      { text: "Grote portie, kom hongerig.", author: "Sofia G.", rating: 5 },
      { text: "Beste ribs in de buurt.", author: "Hassan L.", rating: 5 },
    ],
  },
  {
    id: "m4", name: "Zwijntje van 'Full House'",
    nameIt: "Filetti di maiale avvolti in pancetta affumicata",
    price: 20.00, category: "main",
    ingredients: ["Varkenshaas", "Katenspek", "Aardappel", "Groenten"],
    allergens: [],
    reviews: [
      { text: "Sappig en vol smaak.", author: "Ralph V.", rating: 5 },
      { text: "Het spek maakt het af.", author: "Ingrid S.", rating: 5 },
    ],
  },
  {
    id: "m5", name: "Mijn Naam Is Haas",
    nameIt: "Due medaglioni di maiale con salsa brie e gorgonzola",
    price: 22.50, category: "main",
    ingredients: ["Varkenshaas tournedos", "Brie", "Gorgonzola", "Groenten"],
    allergens: ["Melk"],
    reviews: [
      { text: "Brie en gorgonzola — hemels.", author: "Daan K.", rating: 5 },
      { text: "Verfijnd voor een eetcafé.", author: "Petra M.", rating: 5 },
    ],
  },
  {
    id: "m6", name: "Varkenshaas",
    nameIt: "Filetto di maiale con friet e groenten",
    price: 21.00, category: "main",
    ingredients: ["Varkenshaas", "Friet", "Groenten"],
    allergens: [],
    reviews: [
      { text: "Mooi mals stukje vlees.", author: "Karin D.", rating: 5 },
    ],
  },
  {
    id: "m7", name: "Kogelbiefstuk",
    nameIt: "Controfiletto di manzo ~220g",
    price: 22.00, category: "main",
    ingredients: ["Kogelbiefstuk ±220g", "Friet", "Groenten"],
    allergens: [],
    reviews: [
      { text: "Mals en sappig, precies goed gebakken.", author: "Stefan W.", rating: 5 },
      { text: "Mijn favoriet van de kaart.", author: "Marco F.", rating: 5 },
    ],
  },
  {
    id: "m8", name: "Kogelbiefstuk Op Zijn Best",
    nameIt: "Controfiletto con champignons, cipolla, peperoni e pancetta",
    price: 22.00, category: "main",
    ingredients: ["Kogelbiefstuk ±220g", "Champignons", "Uitjes", "Paprika", "Spekjes"],
    allergens: [],
    reviews: [
      { text: "De garnering maakt het compleet.", author: "Annet R.", rating: 5 },
    ],
  },
  {
    id: "m9", name: "Barhap",
    nameIt: "Piatto misto da bar — la scelta veloce della casa",
    price: 13.00, category: "main",
    ingredients: ["Kroket", "Frikandel", "Friet"],
    allergens: ["Gluten"],
    reviews: [
      { text: "Lekker simpel en vullend.", author: "Ger T.", rating: 4 },
    ],
  },
  {
    id: "m10", name: "Vegetarisch Gerecht",
    nameIt: "Piatto vegetariano del giorno",
    price: 16.00, category: "main",
    ingredients: ["Seizoensgroenten", "Aardappel"],
    allergens: ["Melk"],
    reviews: [
      { text: "Verrassend lekker vegetarisch gerecht.", author: "Lisa V.", rating: 4 },
    ],
  },
  {
    id: "m11", name: "Hete Bliksem",
    nameIt: "Puntine di filetto di manzo piccanti in sambal",
    price: 17.00, category: "main",
    ingredients: ["Ossenhaaspuntjes", "Sambal", "Friet", "Groenten"],
    allergens: [],
    reviews: [
      { text: "Pittig maar heerlijk!", author: "Jos B.", rating: 5 },
    ],
  },
  {
    id: "m12", name: "Zwijne Hackse",
    nameIt: "Stinco di maiale cotto lentamente",
    price: 21.00, category: "main",
    ingredients: ["Varkenspoot", "Kruiden", "Friet", "Groenten"],
    allergens: [],
    reviews: [
      { text: "Groot, rustiek en heerlijk.", author: "Piet V.", rating: 5 },
    ],
  },

  // ── Hoofdgerechten — Rundvlees / Beef ─────────────────────────────────────
  {
    id: "b1", name: "Ossenhaas Van Munster",
    nameIt: "Filetto di manzo ~200g con Munster",
    price: 24.00, category: "main",
    ingredients: ["Ossenhaas ±200g", "Friet", "Groenten"],
    allergens: [],
    reviews: [
      { text: "Prachtige kwaliteit ossenhaas.", author: "Henk V.", rating: 5 },
    ],
  },
  {
    id: "b2", name: "Ossenhaas Iets Beter",
    nameIt: "Filetto di manzo ~200g in burro alle erbe con pane",
    price: 25.00, category: "main",
    ingredients: ["Ossenhaas ±200g", "Kruidenboter", "Wit brood"],
    allergens: ["Gluten", "Melk"],
    reviews: [
      { text: "Met kruidenboter is hij perfect.", author: "Riet K.", rating: 5 },
    ],
  },
  {
    id: "b3", name: "Ossenhaas Op Z'n Best",
    nameIt: "Filetto di manzo ~300g con champignons, cipolla e spek",
    price: 34.50, category: "main",
    ingredients: ["Ossenhaas ±300g", "Champignons", "Uitjes", "Paprika", "Spekjes"],
    allergens: [],
    reviews: [
      { text: "De ultieme ossenhaas — het is de naam waard.", author: "Bert D.", rating: 5 },
    ],
  },
  {
    id: "b4", name: "Lady-Steak",
    nameIt: "Bistecca Lady ~220g — morbida e saporita",
    price: 20.00, category: "main",
    ingredients: ["Lady-Steak ±220g", "Friet", "Groenten"],
    allergens: [],
    reviews: [
      { text: "Mals en smaakvol, aanrader!", author: "Sandra W.", rating: 5 },
    ],
  },
  {
    id: "b5", name: "Ribeye Van De Grill",
    nameIt: "Ribeye alla griglia — succo e sapore garantiti",
    price: 30.00, category: "main",
    ingredients: ["Ribeye", "Friet", "Groenten"],
    allergens: [],
    reviews: [
      { text: "Beste ribeye die ik ooit heb gegeten.", author: "Frank M.", rating: 5 },
    ],
  },
  {
    id: "b6", name: "Surf & Turf",
    nameIt: "Filetto di manzo ~200g con due gamberi reali",
    price: 30.00, category: "main",
    ingredients: ["Ossenhaas ±200g", "Gamba's", "Friet", "Groenten"],
    allergens: ["Schaaldieren"],
    reviews: [
      { text: "Het beste van land en zee op één bord.", author: "Rob H.", rating: 5 },
    ],
  },
  {
    id: "b7", name: "Mixed Grill",
    nameIt: "Grigliata mista: pollo, bistecca, entrecôte, lombata",
    price: 27.50, category: "main",
    ingredients: ["Kip", "Biefstuk", "Entrecôte", "Varkenshaas tournedos", "Friet"],
    allergens: [],
    reviews: [
      { text: "Voor wie niet kan kiezen — alles op één bord!", author: "Cees T.", rating: 5 },
    ],
  },
  {
    id: "b8", name: "T-Bone",
    nameIt: "T-Bone ~500g alla griglia — il re della carta",
    price: 28.50, category: "main",
    ingredients: ["T-Bone ±500g", "Friet", "Groenten"],
    allergens: [],
    reviews: [
      { text: "Indrukwekkend groot, heerlijk van smaak.", author: "Willem B.", rating: 5 },
    ],
  },
  {
    id: "b9", name: "Lamshaasjes",
    nameIt: "Filettini di agnello alla griglia con pesto e aglio",
    price: 25.50, category: "main",
    ingredients: ["Lamshaas", "Knoflook", "Pesto", "Friet", "Groenten"],
    allergens: [],
    reviews: [
      { text: "Verfijnd en anders dan anders.", author: "Miriam L.", rating: 5 },
    ],
  },

  // ── Saté ──────────────────────────────────────────────────────────────────
  {
    id: "sa1", name: "Lekker Kippig",
    nameIt: "Spiedino di pollo con salsa saté e arachidi",
    price: 18.00, category: "main",
    ingredients: ["Kipspies", "Satésaus", "Friet", "Salade"],
    allergens: ["Pinda", "Soja"],
    reviews: [
      { text: "Grote portie, perfecte satésaus.", author: "Fatou D.", rating: 5 },
    ],
  },
  {
    id: "sa2", name: "Ossenhaas Saté",
    nameIt: "Spiedino di filetto di manzo con salsa saté",
    price: 18.50, category: "main",
    ingredients: ["Ossenhaas ±250g", "Satésaus", "Friet", "Salade"],
    allergens: ["Pinda", "Soja"],
    reviews: [
      { text: "Ossenhaas op een stokje — uniek!", author: "Ton K.", rating: 5 },
    ],
  },
  {
    id: "sa3", name: "Varkenshaas Saté",
    nameIt: "Spiedino di filetto di maiale con salsa saté",
    price: 19.50, category: "main",
    ingredients: ["Varkenshaas", "Satésaus", "Friet", "Salade"],
    allergens: ["Pinda", "Soja"],
    reviews: [
      { text: "Mals en heerlijk met de satésaus.", author: "Mia V.", rating: 4 },
    ],
  },
  {
    id: "sa4", name: "Alle Gekheid Op Een Stokje",
    nameIt: "Il misto saté — pollo, manzo e maiale sullo stesso spiedino",
    price: 20.00, category: "main",
    ingredients: ["Kipspies", "Ossenhaas", "Varkenshaas", "Satésaus", "Friet"],
    allergens: ["Pinda", "Soja"],
    reviews: [
      { text: "Voor wie niet kan kiezen!", author: "Rick P.", rating: 5 },
    ],
  },

  // ── Uit Volle Zee / Fish mains ─────────────────────────────────────────────
  {
    id: "f1", name: "Slip of The Tong",
    nameIt: "Tre filetti di sogliola fritti nel burro",
    price: 24.50, category: "fish",
    ingredients: ["Sliptong", "Roomboter", "Friet", "Groenten"],
    allergens: ["Vis", "Melk"],
    reviews: [
      { text: "Verse tong, perfect gebakken.", author: "Greet H.", rating: 5 },
      { text: "Klassiek en heerlijk.", author: "Arie S.", rating: 5 },
    ],
  },
  {
    id: "f2", name: "Big Brother",
    nameIt: "Rombo intero ~450-500g alla griglia",
    price: 35.00, category: "fish",
    ingredients: ["Zeetang ±500g", "Kruiden", "Friet", "Groenten"],
    allergens: ["Vis"],
    reviews: [
      { text: "Indrukwekkend groot en vers.", author: "Ben O.", rating: 5 },
    ],
  },
  {
    id: "f3", name: "Big Picasso",
    nameIt: "Rombo intero con frutta calda e zenzero",
    price: 38.00, category: "fish",
    ingredients: ["Zeetang ±500g", "Warme vruchten", "Gember"],
    allergens: ["Vis"],
    reviews: [
      { text: "Onverwachte combinatie, fantastisch.", author: "Noor A.", rating: 5 },
    ],
  },
  {
    id: "f4", name: "Atlantische Tongfilet",
    nameIt: "Filetto di sogliola atlantica con salsa all'aneto",
    price: 20.00, category: "fish",
    ingredients: ["Tongfilet", "Dillesaus", "Friet", "Groenten"],
    allergens: ["Vis", "Melk"],
    reviews: [
      { text: "Licht en smaakvol, de dillesaus is top.", author: "Inge W.", rating: 5 },
    ],
  },
  {
    id: "f5", name: "Zalmfilet",
    nameIt: "Filetto di salmone al forno con pesto e sesamo su tagliatelle",
    price: 22.50, category: "fish",
    ingredients: ["Zalmfilet", "Pesto", "Sesamzaadjes", "Tagliatelle"],
    allergens: ["Vis", "Gluten", "Sesam", "Noten"],
    reviews: [
      { text: "Zalm perfect gaar, pasta heerlijk.", author: "Lotte B.", rating: 5 },
      { text: "Mooie presentatie, smaakvol.", author: "Hans P.", rating: 5 },
    ],
  },
  {
    id: "f6", name: "Vier-Op-Een-Rij",
    nameIt: "Quattro filetti di pesce del giorno con salsa dello chef",
    price: 26.00, category: "fish",
    ingredients: ["Wisselende visfilets ×4", "Heerlijke saus", "Friet", "Groenten"],
    allergens: ["Vis", "Melk"],
    reviews: [
      { text: "Altijd verrassend en altijd lekker.", author: "Hilde K.", rating: 5 },
    ],
  },
  {
    id: "f7", name: "Het Vieze Vingerwerk",
    nameIt: "Gamberi giganti non sgusciati nel burro alle erbe — mangiate con le mani!",
    price: 25.00, category: "fish",
    ingredients: ["Grote gamba's", "Kruidenboter", "Knoflook"],
    allergens: ["Schaaldieren", "Melk"],
    reviews: [
      { text: "Vies maar heerlijk — bestel extra servetten!", author: "Joep N.", rating: 5 },
      { text: "De beste manier om gamba's te eten.", author: "Lies R.", rating: 5 },
    ],
  },
  {
    id: "f8", name: "Het Schone Vingerwerk",
    nameIt: "Gamberi giganti già sgusciati con aglio e burro — per i più eleganti",
    price: 23.00, category: "fish",
    ingredients: ["Grote gamba's gepeld", "Knoflook", "Kruidenboter"],
    allergens: ["Schaaldieren", "Melk"],
    reviews: [
      { text: "Schoon en heerlijk tegelijk.", author: "Ria D.", rating: 5 },
    ],
  },

  // ── Voor het Kroost / Children ─────────────────────────────────────────────
  {
    id: "k1", name: "Lekker Uit Het Vet",
    nameIt: "Frikandel o kroket con patatine, composta di mele e gelato",
    price: 7.00, category: "kids",
    ingredients: ["Frikandel of kroket", "Friet", "Appelmoes", "Snoepje", "Waterijsje"],
    allergens: ["Gluten"],
    reviews: [
      { text: "Kinderen zijn er gek op!", author: "Marieke V.", rating: 5 },
    ],
  },
  {
    id: "k2", name: "Kinder-Poweeeerrrr",
    nameIt: "Nuggets di pollo con patatine, composta di mele e gelato",
    price: 7.00, category: "kids",
    ingredients: ["Kip-Nuggets", "Friet", "Appelmoes", "Snoepje", "Waterijsje"],
    allergens: ["Gluten", "Ei"],
    reviews: [
      { text: "Mijn dochter wil niks anders meer.", author: "Tom H.", rating: 5 },
    ],
  },
  {
    id: "k3", name: "Beau's Poweeeerrrrr",
    nameIt: "Schnitzel dei bimbi con patatine, composta di mele e gelato",
    price: 7.50, category: "kids",
    ingredients: ["Schnitzel", "Friet", "Appelmoes", "Snoepje", "Waterijsje"],
    allergens: ["Gluten", "Ei"],
    reviews: [
      { text: "Beau is altijd blij!", author: "Sandra T.", rating: 5 },
    ],
  },

  // ── Desserts ───────────────────────────────────────────────────────────────
  {
    id: "des1", name: "Da White Lady",
    nameIt: "Gelato con salsa calda al cioccolato",
    price: 8.50, category: "dessert",
    ingredients: ["Roomijs", "Warme chocoladesaus"],
    allergens: ["Melk"],
    reviews: [
      { text: "Simpel maar hemels.", author: "Corry B.", rating: 5 },
    ],
  },
  {
    id: "des2", name: "Cherry's",
    nameIt: "Gelato con ciliegie calde",
    price: 8.50, category: "dessert",
    ingredients: ["Roomijs", "Warme kersen"],
    allergens: ["Melk"],
    reviews: [
      { text: "De kersen zijn heerlijk warm.", author: "Nel K.", rating: 5 },
    ],
  },
  {
    id: "des3", name: "Banana's In The Split",
    nameIt: "Banana split con gelato, banane e salsa al cioccolato",
    price: 8.50, category: "dessert",
    ingredients: ["Roomijs", "Banaan", "Chocoladesaus"],
    allergens: ["Melk"],
    reviews: [
      { text: "Een klassieker die nooit vervelen wordt.", author: "Dick P.", rating: 5 },
    ],
  },
  {
    id: "des4", name: "Pallet 'Full House'",
    nameIt: "Mousse al cioccolato, mousse alla vaniglia e gelato — il piatto firma",
    price: 9.00, category: "dessert",
    ingredients: ["Chocolade mousse", "Vanilla mousse", "Roomijs"],
    allergens: ["Melk", "Ei"],
    reviews: [
      { text: "Drie desserts in één — de winnaar!", author: "Joke V.", rating: 5 },
      { text: "Bestellen en genieten.", author: "Ad M.", rating: 5 },
    ],
  },
  {
    id: "des5", name: "Crème Brûlée",
    nameIt: "Crème brûlée classica con crosta di zucchero caramellato",
    price: 9.00, category: "dessert",
    ingredients: ["Room", "Ei", "Suiker", "Vanille"],
    allergens: ["Melk", "Ei"],
    reviews: [
      { text: "Perfecte caramellaag, romige vulling.", author: "Yolanda S.", rating: 5 },
    ],
  },
  {
    id: "des6", name: "Cheesecake",
    nameIt: "Cheesecake cremosa della casa",
    price: 9.00, category: "dessert",
    ingredients: ["Roomkaas", "Koekbodem", "Slagroom"],
    allergens: ["Melk", "Gluten", "Ei"],
    reviews: [
      { text: "Heerlijk romig en niet te zwaar.", author: "Bea T.", rating: 5 },
    ],
  },
  {
    id: "des7", name: "Kaneelijs",
    nameIt: "Gelato alla cannella — speziato e delicato",
    price: 9.00, category: "dessert",
    ingredients: ["Kaneelijs", "Slagroom"],
    allergens: ["Melk"],
    reviews: [
      { text: "Bijzonder en heerlijk.", author: "Loes D.", rating: 4 },
    ],
  },
  {
    id: "des8", name: "Kaatje Mossel",
    nameIt: "Gelato con advocaat (liquore all'uovo) e panna montata",
    price: 9.00, category: "dessert",
    ingredients: ["Roomijs", "Advocaat", "Slagroom"],
    allergens: ["Melk", "Ei"],
    reviews: [
      { text: "De advocaat maakt het bijzonder.", author: "Koos W.", rating: 5 },
    ],
  },
  {
    id: "des9", name: "Choco Taartje",
    nameIt: "Tortino al cioccolato caldo con gelato e panna",
    price: 9.50, category: "dessert",
    ingredients: ["Chocoladetaart", "Roomijs", "Slagroom"],
    allergens: ["Melk", "Gluten", "Ei"],
    reviews: [
      { text: "Warme taart + koud ijs = perfecte combo.", author: "Els R.", rating: 5 },
    ],
  },
  {
    id: "des10", name: "Tiramisu",
    nameIt: "Tiramisù classico italiano",
    price: 9.50, category: "dessert",
    ingredients: ["Mascarpone", "Espresso", "Savoiardi", "Cacao"],
    allergens: ["Melk", "Gluten", "Ei"],
    reviews: [
      { text: "Net zo lekker als in Italië.", author: "Marisa G.", rating: 5 },
      { text: "Romig en niet te zoet.", author: "Pier V.", rating: 5 },
    ],
  },
  {
    id: "des11", name: "Coupe Walnoot",
    nameIt: "Coppa con gelato alla noce, panna e salsa al caramello",
    price: 13.50, category: "dessert",
    ingredients: ["Roomijs", "Walnoten", "Slagroom", "Caramelsaus"],
    allergens: ["Melk", "Noten"],
    reviews: [
      { text: "Groot dessert, kan met twee personen.", author: "Gerda L.", rating: 5 },
    ],
  },
  {
    id: "des12", name: "Coupe 'Full House'",
    nameIt: "La coppa della casa — sorprende sempre (non spaventarti!)",
    price: 13.50, category: "dessert",
    ingredients: ["Roomijs", "Slagroom", "Seizoensfruit", "Sausen"],
    allergens: ["Melk"],
    reviews: [
      { text: "Hij blijft er in... maar wat een verrassing!", author: "Henk J.", rating: 5 },
      { text: "Bestel het en laat je verrassen.", author: "Tineke M.", rating: 5 },
    ],
  },

  // ── Koffie Specialiteiten ──────────────────────────────────────────────────
  { id: "c1", name: "Koffie", nameIt: "Caffè filtro olandese", price: 2.50, category: "coffee" },
  { id: "c2", name: "Espresso", nameIt: "Espresso", price: 2.50, category: "coffee" },
  { id: "c3", name: "Cappuccino", nameIt: "Cappuccino", price: 2.80, category: "coffee", allergens: ["Melk"] },
  { id: "c4", name: "Latte Macchiato", nameIt: "Latte Macchiato", price: 6.50, category: "coffee", allergens: ["Melk"] },
  { id: "c5", name: "Irish Coffee", nameIt: "Whisky irlandese con caffè e panna", price: 10.00, category: "coffee", allergens: ["Melk"] },
  { id: "c6", name: "Spanish Coffee", nameIt: "Tia Maria o Licor 43 con caffè e panna", price: 10.00, category: "coffee", allergens: ["Melk"] },
  { id: "c7", name: "Mexican Coffee", nameIt: "Tequila con caffè e panna", price: 10.00, category: "coffee", allergens: ["Melk"] },
  { id: "c8", name: "French Coffee", nameIt: "Grand Marnier con caffè e panna", price: 10.00, category: "coffee", allergens: ["Melk"] },
  { id: "c9", name: "Dokkumer Koffie", nameIt: "Berenburg (amaro frisone) con caffè e panna", price: 10.00, category: "coffee", allergens: ["Melk"] },

  // ── Frisdranken & Bieren ───────────────────────────────────────────────────
  { id: "d1", name: "Coca Cola / Zero", nameIt: "Coca Cola", price: 2.80, category: "drink" },
  { id: "d2", name: "Fanta Orange / Cassis", nameIt: "Fanta", price: 2.80, category: "drink" },
  { id: "d3", name: "Lipton Ice Tea", nameIt: "Ice Tea", price: 3.00, category: "drink" },
  { id: "d4", name: "Appelsap", nameIt: "Succo di mela", price: 2.80, category: "drink" },
  { id: "d5", name: "Fristi / Chocomel", nameIt: "Bibite per bambini", price: 3.00, category: "drink", allergens: ["Melk"] },
  { id: "d6", name: "Tapbier Fluitje", nameIt: "Birra piccola alla spina", price: 3.00, category: "drink", allergens: ["Gluten"] },
  { id: "d7", name: "Tapbier Vaasje", nameIt: "Birra media alla spina", price: 3.50, category: "drink", allergens: ["Gluten"] },

  // ── Wijnen ────────────────────────────────────────────────────────────────
  { id: "w1", name: "Huiswijn Rood (glas)", nameIt: "Vino rosso della casa", price: 4.50, category: "wine", allergens: ["Sulfiet"] },
  { id: "w2", name: "Huiswijn Wit - Droog (glas)", nameIt: "Vino bianco secco", price: 4.50, category: "wine", allergens: ["Sulfiet"] },
  { id: "w3", name: "Huiswijn Wit - Zoet (glas)", nameIt: "Vino bianco dolce", price: 4.50, category: "wine", allergens: ["Sulfiet"] },
  { id: "w4", name: "Rosé (glas)", nameIt: "Rosé", price: 4.50, category: "wine", allergens: ["Sulfiet"] },
];

export const CATEGORY_LABELS: Record<MenuItem["category"], { nl: string; it: string }> = {
  starter:  { nl: "Voorgerechten",          it: "Antipasti" },
  main:     { nl: "Hoofdgerechten",          it: "Piatti Principali" },
  fish:     { nl: "Uit Volle Zee",           it: "Dal Mare" },
  dessert:  { nl: "Nog Even Wat Na",         it: "Dolci" },
  kids:     { nl: "Voor het Kroost",         it: "Per i Bambini" },
  coffee:   { nl: "Koffie Specialiteiten",   it: "Caffè Speciali" },
  drink:    { nl: "Frisdranken & Bieren",    it: "Bibite & Birre" },
  wine:     { nl: "Wijnen",                  it: "Vini" },
};

export const CATEGORY_ORDER: MenuItem["category"][] = [
  "starter", "main", "fish", "dessert", "kids", "coffee", "drink", "wine",
];
