// Product categories
export interface Category {
  id: number;
  slug: string;
  nameIt: string;
  nameEn: string;
  nameEs: string;
}

// Product data
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

// Cart item
export interface CartItem {
  product: Product;
  quantity: number;
  notes?: string;
}

// User data
export interface User {
  id: number;
  displayName: string;
  email: string;
  avatar?: string;
  loyaltyPoints: number;
  loyaltyLevel: 'bronze' | 'silver' | 'gold';
}

// Subscription type
export type MenuPreference = 'standard' | 'vegetarian' | 'halal' | 'glutenFree';
export type WeekDay = 'mon' | 'tue' | 'wed' | 'thu' | 'fri';
export type DeliveryTime = '11:00' | '17:00';

// Categories data
export const categories: Category[] = [
  { id: 1, slug: 'panini', nameIt: 'Panini Premium', nameEn: 'Premium Sandwiches', nameEs: 'Sándwiches Premium' },
  { id: 2, slug: 'primi', nameIt: 'Primi Piatti', nameEn: 'Pasta Dishes', nameEs: 'Platos de Pasta' },
  { id: 3, slug: 'secondi', nameIt: 'Secondi Gourmet', nameEn: 'Gourmet Mains', nameEs: 'Platos Principales Gourmet' },
  { id: 4, slug: 'contorni', nameIt: 'Contorni', nameEn: 'Side Dishes', nameEs: 'Guarniciones' },
  { id: 5, slug: 'bevande', nameIt: 'Bevande', nameEn: 'Beverages', nameEs: 'Bebidas' }
];

// Products data
export const products: Product[] = [
  {
    id: 1,
    categoryId: 1,
    nameIt: 'Panino Toscano',
    nameEn: 'Tuscan Sandwich',
    nameEs: 'Sándwich Toscano',
    descriptionIt: 'Prosciutto crudo, mozzarella di bufala, rucola e pomodori secchi su pane toscano',
    descriptionEn: 'Prosciutto, buffalo mozzarella, arugula and sun-dried tomatoes on Tuscan bread',
    descriptionEs: 'Jamón crudo, mozzarella de búfala, rúcula y tomates secos en pan toscano',
    price: 8.50,
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
    price: 7.50,
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
    price: 8.90,
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
    price: 9.90,
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
    price: 8.90,
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
    price: 7.50,
    imageUrl: 'https://cdn.pixabay.com/photo/2017/05/05/19/06/tomato-mozzarella-2287859_1280.jpg',
    isPopular: false,
    isVegetarian: true,
    isCustomizable: false
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
    price: 10.50,
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
    price: 12.90,
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
    price: 14.90,
    imageUrl: 'https://images.unsplash.com/photo-1600891964068-3b1ea9fbce82?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400',
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
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400',
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
    price: 1.50,
    imageUrl: 'https://images.unsplash.com/photo-1564419320461-6870880221ad?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400',
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
