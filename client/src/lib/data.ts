// Type definitions
export type Language = 'it' | 'en' | 'es' | 'nl';

// Interfaces
export interface Category {
  id: number;
  slug: string;
  nameIt: string;
  nameEn: string;
  nameEs: string;
}

export interface Product {
  id: number;
  categoryId: number;
  nameIt: string;
  nameEn: string;
  nameEs: string;
  descriptionIt: string;
  descriptionEn: string;
  descriptionEs: string;
  price: number;
  imageUrl: string;
  isPopular: boolean;
  isVegetarian: boolean;
  isCustomizable: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  notes?: string;
}

export interface User {
  id: number;
  displayName: string;
  email: string;
  avatar?: string;
  loyaltyPoints: number;
  loyaltyLevel: 'bronze' | 'silver' | 'gold';
}

export type MenuPreference = 'standard' | 'vegetarian' | 'halal';
export type WeekDay = 'mon' | 'tue' | 'wed' | 'thu' | 'fri';
export type DeliveryTime = '11:00' | '17:00';

// Categories data
export const categories: Category[] = [
  { id: 1, slug: 'panini', nameIt: 'Panini', nameEn: 'Sandwiches', nameEs: 'Sandwiches' },
  { id: 2, slug: 'primi', nameIt: 'Primi Piatti', nameEn: 'Pasta Dishes', nameEs: 'Platos de Pasta' },
  { id: 3, slug: 'secondi', nameIt: 'Secondi Gourmet', nameEn: 'Gourmet Mains', nameEs: 'Platos Principales Gourmet' },
  { id: 4, slug: 'contorni', nameIt: 'Contorni', nameEn: 'Side Dishes', nameEs: 'Guarniciones' },
  { id: 5, slug: 'bevande', nameIt: 'Bevande', nameEn: 'Beverages', nameEs: 'Bebidas' }
];

// Products data
export const products: Product[] = [
  // Panini Premium - Tutti allo stesso prezzo (10€)
  {
    id: 1,
    categoryId: 1,
    nameIt: 'Panino Toscano',
    nameEn: 'Tuscan Sandwich',
    nameEs: 'Sándwich Toscano',
    descriptionIt: 'Prosciutto crudo, mozzarella di bufala, rucola e pomodori secchi su pane toscano',
    descriptionEn: 'Prosciutto, buffalo mozzarella, arugula and sun-dried tomatoes on Tuscan bread',
    descriptionEs: 'Jamón crudo, mozzarella de búfala, rúcula y tomates secos en pan toscano',
    price: 10.00,
    imageUrl: 'https://images.unsplash.com/photo-1550507992-eb63ffee0847?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400',
    isPopular: true,
    isVegetarian: false,
    isCustomizable: false
  },
  {
    id: 2,
    categoryId: 1,
    nameIt: 'Vegetariano Deluxe',
    nameEn: 'Vegetarian Deluxe',
    nameEs: 'Vegetariano Deluxe',
    descriptionIt: 'Verdure grigliate, pesto di basilico, formaggio di capra e hummus su pane ai cereali',
    descriptionEn: 'Grilled vegetables, basil pesto, goat cheese and hummus on multigrain bread',
    descriptionEs: 'Verduras a la parrilla, pesto de albahaca, queso de cabra y hummus en pan de cereales',
    price: 10.00,
    imageUrl: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400',
    isPopular: false,
    isVegetarian: true,
    isCustomizable: false
  },
  {
    id: 3,
    categoryId: 1,
    nameIt: 'Rustico Calabrese',
    nameEn: 'Calabrian Rustic',
    nameEs: 'Rústico Calabrés',
    descriptionIt: 'Salame piccante, provolone, crema di olive e peperoni arrostiti su pane rustico',
    descriptionEn: 'Spicy salami, provolone, olive spread and roasted peppers on rustic bread',
    descriptionEs: 'Salami picante, provolone, crema de aceitunas y pimientos asados ​​en pan rústico',
    price: 10.00,
    imageUrl: 'https://images.unsplash.com/photo-1628294896516-344152572ee8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400',
    isPopular: false,
    isVegetarian: false,
    isCustomizable: true
  },
  {
    id: 4,
    categoryId: 1,
    nameIt: 'Nordico Premium',
    nameEn: 'Nordic Premium',
    nameEs: 'Nórdico Premium',
    descriptionIt: 'Salmone affumicato, formaggio spalmabile alle erbe, avocado e aneto su pane integrale',
    descriptionEn: 'Smoked salmon, herb cream cheese, avocado and dill on whole grain bread',
    descriptionEs: 'Salmón ahumado, queso crema de hierbas, aguacate y eneldo en pan integral',
    price: 10.00,
    imageUrl: 'https://images.unsplash.com/photo-1619096252214-ef06c45683e3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400',
    isPopular: true,
    isVegetarian: false,
    isCustomizable: false
  },
  {
    id: 5,
    categoryId: 1,
    nameIt: 'Porchetta Romani',
    nameEn: 'Roman Porchetta',
    nameEs: 'Porchetta Romana',
    descriptionIt: 'Porchetta di Ariccia, cicoria ripassata, pecorino romano e salsa verde su ciabatta',
    descriptionEn: 'Ariccia porchetta, sautéed chicory, pecorino romano and salsa verde on ciabatta',
    descriptionEs: 'Porchetta de Ariccia, achicoria salteada, pecorino romano y salsa verde en ciabatta',
    price: 10.00,
    imageUrl: 'https://images.unsplash.com/photo-1504937551116-cb8097e6f02a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400',
    isPopular: false,
    isVegetarian: false,
    isCustomizable: true
  },
  {
    id: 6,
    categoryId: 1,
    nameIt: 'Caprese Classico',
    nameEn: 'Classic Caprese',
    nameEs: 'Caprese Clásico',
    descriptionIt: 'Mozzarella di bufala, pomodoro cuore di bue, basilico fresco e olio EVO su focaccia',
    descriptionEn: 'Buffalo mozzarella, beef tomato, fresh basil and extra virgin olive oil on focaccia',
    descriptionEs: 'Mozzarella de búfala, tomate corazón de buey, albahaca fresca y aceite de oliva virgen extra en focaccia',
    price: 10.00,
    imageUrl: 'https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400',
    isPopular: false,
    isVegetarian: true,
    isCustomizable: false
  },
  // NUOVI PANINI CON POLLO E AGNELLO
  {
    id: 12,
    categoryId: 1,
    nameIt: 'Pollo Mediterraneo',
    nameEn: 'Mediterranean Chicken',
    nameEs: 'Pollo Mediterráneo',
    descriptionIt: 'Pollo alla griglia, peperoni arrostiti, hummus, rucola e salsa tzatziki su pane pita',
    descriptionEn: 'Grilled chicken, roasted peppers, hummus, arugula and tzatziki sauce on pita bread',
    descriptionEs: 'Pollo a la parrilla, pimientos asados, hummus, rúcula y salsa tzatziki en pan de pita',
    price: 10.00,
    imageUrl: 'https://images.unsplash.com/photo-1521305916504-4a1121188589?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400',
    isPopular: true,
    isVegetarian: false,
    isCustomizable: true
  },
  {
    id: 13,
    categoryId: 1,
    nameIt: 'Pollo Caesar',
    nameEn: 'Chicken Caesar',
    nameEs: 'Pollo Caesar',
    descriptionIt: 'Pollo alla griglia, lattuga romana, parmigiano, crostini e salsa caesar su baguette',
    descriptionEn: 'Grilled chicken, romaine lettuce, parmesan, croutons and caesar dressing on baguette',
    descriptionEs: 'Pollo a la parrilla, lechuga romana, parmesano, picatostes y salsa césar en baguette',
    price: 10.00,
    imageUrl: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400',
    isPopular: false,
    isVegetarian: false,
    isCustomizable: true
  },
  {
    id: 14,
    categoryId: 1,
    nameIt: 'Pollo BBQ',
    nameEn: 'BBQ Chicken',
    nameEs: 'Pollo BBQ',
    descriptionIt: 'Pollo sfilacciato in salsa BBQ, coleslaw, cipolla caramellata e cheddar su panino morbido',
    descriptionEn: 'Pulled chicken in BBQ sauce, coleslaw, caramelized onion and cheddar on soft bun',
    descriptionEs: 'Pollo desmenuzado en salsa BBQ, coleslaw, cebolla caramelizada y cheddar en pan suave',
    price: 10.00,
    imageUrl: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400',
    isPopular: true,
    isVegetarian: false,
    isCustomizable: false
  },
  {
    id: 15,
    categoryId: 1,
    nameIt: 'Agnello Greco',
    nameEn: 'Greek Lamb',
    nameEs: 'Cordero Griego',
    descriptionIt: 'Agnello speziato, yogurt greco, cetrioli, pomodoro e cipolla rossa su pita',
    descriptionEn: 'Spiced lamb, Greek yogurt, cucumber, tomato and red onion on pita bread',
    descriptionEs: 'Cordero especiado, yogur griego, pepino, tomate y cebolla roja en pan de pita',
    price: 10.00,
    imageUrl: 'https://images.unsplash.com/photo-1529059997568-3d847b1154f0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400',
    isPopular: false,
    isVegetarian: false,
    isCustomizable: true
  },
  {
    id: 16,
    categoryId: 1,
    nameIt: 'Agnello Marocchino',
    nameEn: 'Moroccan Lamb',
    nameEs: 'Cordero Marroquí',
    descriptionIt: 'Agnello con spezie ras el hanout, hummus di carote, olive, menta e harissa su focaccia',
    descriptionEn: 'Ras el hanout spiced lamb, carrot hummus, olives, mint and harissa on focaccia',
    descriptionEs: 'Cordero con especias ras el hanout, hummus de zanahoria, aceitunas, menta y harissa en focaccia',
    price: 10.00,
    imageUrl: 'https://images.unsplash.com/photo-1530469912745-a215c6b256ea?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400',
    isPopular: true,
    isVegetarian: false,
    isCustomizable: false
  },
  {
    id: 17,
    categoryId: 1,
    nameIt: 'Fusion Pollo e Agnello',
    nameEn: 'Chicken & Lamb Fusion',
    nameEs: 'Fusión de Pollo y Cordero',
    descriptionIt: 'Combo di pollo grigliato e agnello speziato con salsa di yogurt, menta, lattuga e pomodoro su pane arabo',
    descriptionEn: 'Combo of grilled chicken and spiced lamb with yogurt sauce, mint, lettuce and tomato on arabic bread',
    descriptionEs: 'Combinación de pollo a la parrilla y cordero especiado con salsa de yogur, menta, lechuga y tomate en pan árabe',
    price: 10.00,
    imageUrl: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400',
    isPopular: false,
    isVegetarian: false,
    isCustomizable: true
  },
  // Primi Piatti (Pasta Dishes)
  {
    id: 7,
    categoryId: 2,
    nameIt: 'Spaghetti alla Carbonara',
    nameEn: 'Spaghetti Carbonara',
    nameEs: 'Espaguetis a la Carbonara',
    descriptionIt: 'Spaghetti con uova, guanciale, pecorino romano e pepe nero',
    descriptionEn: 'Spaghetti with eggs, guanciale, pecorino romano and black pepper',
    descriptionEs: 'Espaguetis con huevos, guanciale, pecorino romano y pimienta negra',
    price: 12.00,
    imageUrl: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400',
    isPopular: true,
    isVegetarian: false,
    isCustomizable: false
  },
  {
    id: 8,
    categoryId: 2,
    nameIt: 'Lasagna alla Bolognese',
    nameEn: 'Bolognese Lasagna',
    nameEs: 'Lasaña Boloñesa',
    descriptionIt: 'Strati di pasta con ragù di carne, besciamella e parmigiano',
    descriptionEn: 'Layers of pasta with meat ragù, béchamel sauce and parmesan',
    descriptionEs: 'Capas de pasta con ragú de carne, bechamel y parmesano',
    price: 15.00,
    imageUrl: 'https://images.unsplash.com/photo-1619895092538-128341789043?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400',
    isPopular: true,
    isVegetarian: false,
    isCustomizable: false
  },
  // Secondi Gourmet (Gourmet Mains)
  {
    id: 9,
    categoryId: 3,
    nameIt: 'Tagliata di Manzo',
    nameEn: 'Sliced Beef Steak',
    nameEs: 'Filete de Ternera Cortado',
    descriptionIt: 'Controfiletto di manzo con rucola, parmigiano e aceto balsamico',
    descriptionEn: 'Beef sirloin with arugula, parmesan and balsamic vinegar',
    descriptionEs: 'Solomillo de ternera con rúcula, parmesano y vinagre balsámico',
    price: 18.00,
    imageUrl: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400',
    isPopular: false,
    isVegetarian: false,
    isCustomizable: true
  },
  // Contorni (Side Dishes)
  {
    id: 10,
    categoryId: 4,
    nameIt: 'Patate Arrosto',
    nameEn: 'Roasted Potatoes',
    nameEs: 'Patatas Asadas',
    descriptionIt: 'Patate al forno con rosmarino e aglio',
    descriptionEn: 'Oven-roasted potatoes with rosemary and garlic',
    descriptionEs: 'Patatas al horno con romero y ajo',
    price: 4.50,
    imageUrl: 'https://images.unsplash.com/photo-1581004705471-d5a9818a657c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400',
    isPopular: false,
    isVegetarian: true,
    isCustomizable: false
  },
  // Bevande (Beverages)
  {
    id: 11,
    categoryId: 5,
    nameIt: 'Acqua Minerale',
    nameEn: 'Mineral Water',
    nameEs: 'Agua Mineral',
    descriptionIt: 'Acqua minerale naturale o frizzante (50cl)',
    descriptionEn: 'Still or sparkling mineral water (50cl)',
    descriptionEs: 'Agua mineral con o sin gas (50cl)',
    price: 2.00,
    imageUrl: 'https://images.unsplash.com/photo-1564419320461-6870880221ad?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400',
    isPopular: false,
    isVegetarian: true,
    isCustomizable: false
  },
  // NUOVE BEVANDE
  {
    id: 18,
    categoryId: 5,
    nameIt: 'Acqua Naturale',
    nameEn: 'Still Water',
    nameEs: 'Agua Natural',
    descriptionIt: 'Acqua naturale (50cl)',
    descriptionEn: 'Still water (50cl)',
    descriptionEs: 'Agua natural (50cl)',
    price: 2.00,
    imageUrl: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400',
    isPopular: true,
    isVegetarian: true,
    isCustomizable: false
  },
  {
    id: 19,
    categoryId: 5,
    nameIt: 'Coca-Cola',
    nameEn: 'Coca-Cola',
    nameEs: 'Coca-Cola',
    descriptionIt: 'Coca-Cola classica (33cl)',
    descriptionEn: 'Classic Coca-Cola (33cl)',
    descriptionEs: 'Coca-Cola clásica (33cl)',
    price: 3.00,
    imageUrl: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400',
    isPopular: true,
    isVegetarian: true,
    isCustomizable: false
  },
  {
    id: 20,
    categoryId: 5,
    nameIt: 'Fanta',
    nameEn: 'Fanta',
    nameEs: 'Fanta',
    descriptionIt: 'Fanta all\'arancia (33cl)',
    descriptionEn: 'Orange Fanta (33cl)',
    descriptionEs: 'Fanta de naranja (33cl)',
    price: 3.00,
    imageUrl: 'https://images.unsplash.com/photo-1624552184280-9e9631befb32?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400',
    isPopular: false,
    isVegetarian: true,
    isCustomizable: false
  }
];

// Return products by category
export function getProductsByCategory(categoryId: number): Product[] {
  return products.filter(product => product.categoryId === categoryId);
}

// Get category by ID
export function getCategoryById(categoryId: number): Category | undefined {
  return categories.find(category => category.id === categoryId);
}

// Get product by ID
export function getProductById(productId: number): Product | undefined {
  return products.find(product => product.id === productId);
}