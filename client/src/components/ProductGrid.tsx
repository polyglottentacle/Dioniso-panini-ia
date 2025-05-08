import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getProductsByCategory, getCategoryById } from "@/lib/data";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  categoryId: number;
}

export default function ProductGrid({ categoryId }: ProductGridProps) {
  const { language } = useLanguage();
  const [products, setProducts] = useState(getProductsByCategory(categoryId));
  const category = getCategoryById(categoryId);
  
  // Get category name for current language
  const categoryName = category 
    ? (language === 'it' ? category.nameIt : 
       language === 'en' ? category.nameEn : 
       category.nameEs)
    : '';
  
  // Update products when category changes
  useEffect(() => {
    setProducts(getProductsByCategory(categoryId));
  }, [categoryId]);
  
  return (
    <section className="mb-12">
      <h3 className="text-2xl font-bold mb-6 text-gray-800">{categoryName}</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
