import { useState, useEffect, memo, useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getProductsByCategory, getCategoryById } from "@/lib/data";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  categoryId: number;
}

// Memoizziamo anche il Product Card per aumentare le prestazioni
const MemoizedProductCard = memo(ProductCard);

function ProductGrid({ categoryId }: ProductGridProps) {
  const { language } = useLanguage();
  
  // Utilizziamo useMemo per calcolare i prodotti solo quando cambia la categoria
  const products = useMemo(() => getProductsByCategory(categoryId), [categoryId]);
  
  // Utilizziamo useMemo per calcolare la categoria solo quando cambia l'ID
  const category = useMemo(() => getCategoryById(categoryId), [categoryId]);
  
  // Get category name for current language - memoizzato per evitare ricalcoli inutili
  const categoryName = useMemo(() => {
    if (!category) return '';
    
    if (language === 'it') return category.nameIt;
    if (language === 'en') return category.nameEn;
    if (language === 'es') return category.nameEs;
    if (language === 'nl') return category.nameEn; // Fallback to English for Dutch
    
    return category.nameEn; // Default to English
  }, [category, language]);
  
  return (
    <section className="mb-12">
      <h3 className="text-2xl font-bold mb-6 text-gray-800">{categoryName}</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <MemoizedProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

// Esportiamo un componente memorizzato
export default memo(ProductGrid);
