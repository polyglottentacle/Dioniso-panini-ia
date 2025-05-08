const fs = require('fs');
const path = require('path');

// Leggi il file data.ts
const filePath = path.join(process.cwd(), 'client/src/lib/data.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Aggiorna tutti i prezzi dei panini a 10.00
content = content.replace(/categoryId: 1,[^]*?price: 8\.90/g, (match) => {
  return match.replace(/price: 8\.90/, 'price: 10.00');
});

// Aggiorna i prezzi dei piatti principali
content = content.replace(/price: 10\.50/g, 'price: 12.00');
content = content.replace(/price: 12\.90/g, 'price: 15.00');
content = content.replace(/price: 14\.90/g, 'price: 18.00');

// Aggiorna i prezzi delle bevande
content = content.replace(/price: 1\.50/g, 'price: 2.00');
content = content.replace(/price: 1\.80/g, 'price: 2.50');
content = content.replace(/price: 2\.50/g, 'price: 3.00');
content = content.replace(/price: 3\.20/g, 'price: 3.50');

// Rimuovi le bevande non necessarie (manteniamo solo acqua, caffè, cappuccino e limonata)
content = content.replace(/\/\/ NUOVE BEVANDE[^]*?\{[^]*?id: 21,[^]*?\},[^]*?\/\/ Primi Piatti/gs, '// NUOVE BEVANDE\n  {\n    id: 18,\n    categoryId: 5,\n    nameIt: \'Espresso Italiano\',\n    nameEn: \'Italian Espresso\',\n    nameEs: \'Espresso Italiano\',\n    descriptionIt: \'Caffè espresso tradizionale italiano\',\n    descriptionEn: \'Traditional Italian espresso coffee\',\n    descriptionEs: \'Café espresso tradicional italiano\',\n    price: 2.50,\n    imageUrl: \'https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400\',\n    isPopular: true,\n    isVegetarian: true,\n    isCustomizable: false\n  },\n  {\n    id: 19,\n    categoryId: 5,\n    nameIt: \'Cappuccino\',\n    nameEn: \'Cappuccino\',\n    nameEs: \'Cappuccino\',\n    descriptionIt: \'Espresso con latte montato a vapore e schiuma di latte\',\n    descriptionEn: \'Espresso with steamed milk and milk foam\',\n    descriptionEs: \'Espresso con leche vaporizada y espuma de leche\',\n    price: 3.00,\n    imageUrl: \'https://images.unsplash.com/photo-1534778101976-62847782c213?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400\',\n    isPopular: true,\n    isVegetarian: true,\n    isCustomizable: false\n  },\n  {\n    id: 20,\n    categoryId: 5,\n    nameIt: \'Limonata Fresca\',\n    nameEn: \'Fresh Lemonade\',\n    nameEs: \'Limonada Fresca\',\n    descriptionIt: \'Limonata fatta in casa con limoni freschi e menta\',\n    descriptionEn: \'Homemade lemonade with fresh lemons and mint\',\n    descriptionEs: \'Limonada casera con limones frescos y menta\',\n    price: 3.50,\n    imageUrl: \'https://images.unsplash.com/photo-1523677011781-c91d1bbe2f9e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400\',\n    isPopular: false,\n    isVegetarian: true,\n    isCustomizable: false\n  },\n  // Primi Piatti');

// Scrivi il file aggiornato
fs.writeFileSync(filePath, content, 'utf8');

// Ora aggiorniamo il prezzo dell'abbonamento
const subscriptionFilePath = path.join(process.cwd(), 'client/src/components/Subscription.tsx');
let subscriptionContent = fs.readFileSync(subscriptionFilePath, 'utf8');

// Calcola il prezzo dell'abbonamento (5 panini + 5 bevande con sconto del 15%)
const paninoPrezzoBase = 10.00;
const bevandaPrezzoBase = 3.00; // Prezzo medio delle bevande
const paninoQuantita = 5;
const bevandaQuantita = 5;
const sconto = 0.15;

const totalePreSconto = (paninoPrezzoBase * paninoQuantita) + (bevandaPrezzoBase * bevandaQuantita);
const risparmio = totalePreSconto * sconto;
const totalePostSconto = Math.round(totalePreSconto - risparmio);

// Aggiorna il prezzo dell'abbonamento nel componente
subscriptionContent = subscriptionContent.replace(/'subscription\.price'.*?\{.*?\}/g, `'subscription.price'}>€${totalePostSconto}/settimana`);

fs.writeFileSync(subscriptionFilePath, subscriptionContent, 'utf8');

console.log(`Prezzi aggiornati:
- Panini: 10.00€
- Primi piatti: 12.00€-15.00€
- Secondi: 18.00€
- Bevande: 2.00€-3.50€
- Abbonamento: ${totalePostSconto}€/settimana
`);
