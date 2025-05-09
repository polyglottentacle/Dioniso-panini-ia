import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '@/lib/data';

interface FavoritesContextType {
  favorites: number[];
  addFavorite: (productId: number) => void;
  removeFavorite: (productId: number) => void;
  isFavorite: (productId: number) => boolean;
  favoritesCount: number;
}

// Creazione del contesto con valori di default
const FavoritesContext = createContext<FavoritesContextType>({
  favorites: [],
  addFavorite: () => {},
  removeFavorite: () => {},
  isFavorite: () => false,
  favoritesCount: 0,
});

// Provider del contesto
export function FavoritesProvider({ children }: { children: ReactNode }) {
  // Carica preferiti da localStorage o inizializza vuoto
  const [favorites, setFavorites] = useState<number[]>(() => {
    const savedFavorites = localStorage.getItem('favorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  // Aggiorna localStorage quando cambia l'array dei preferiti
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Aggiungi prodotto ai preferiti
  const addFavorite = (productId: number) => {
    if (!favorites.includes(productId)) {
      setFavorites((prev) => [...prev, productId]);
    }
  };

  // Rimuovi prodotto dai preferiti
  const removeFavorite = (productId: number) => {
    setFavorites((prev) => prev.filter((id) => id !== productId));
  };

  // Controlla se un prodotto è nei preferiti
  const isFavorite = (productId: number) => {
    return favorites.includes(productId);
  };

  // Conteggio dei preferiti
  const favoritesCount = favorites.length;

  return (
    <FavoritesContext.Provider
      value={{ favorites, addFavorite, removeFavorite, isFavorite, favoritesCount }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

// Hook per usare il contesto dei preferiti
export function useFavorites() {
  return useContext(FavoritesContext);
}