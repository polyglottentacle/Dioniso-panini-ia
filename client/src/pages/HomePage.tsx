import { useState, memo, useMemo, useCallback } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import CategoryTabs from "@/components/CategoryTabs";
import ProductGrid from "@/components/ProductGrid";
import Subscription from "@/components/Subscription";
import Footer from "@/components/Footer";
import Cart from "@/components/Cart";
import FavoritesSection from "@/components/FavoritesSection";
import { categories } from "@/lib/data";

// Memorizziamo i componenti per evitare re-render inutili
const MemoizedHeroSection = memo(HeroSection);
const MemoizedCategoryTabs = memo(CategoryTabs);
const MemoizedProductGrid = memo(ProductGrid);
const MemoizedFavoritesSection = memo(FavoritesSection);
const MemoizedSubscription = memo(Subscription);
const MemoizedFooter = memo(Footer);

export default function HomePage() {
  // Utilizziamo una funzione callback memorizzata per evitare ri-creazioni inutili
  const [activeCategory, setActiveCategory] = useState(1); // Default to first category
  
  const handleCategoryChange = useCallback((categoryId: number) => {
    setActiveCategory(categoryId);
  }, []);
  
  // Memorizziamo le categories per evitare ricreazioni inutili
  const categoriesData = useMemo(() => categories, []);
  
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Header />
      
      <main className="container mx-auto px-4 py-6 flex-grow">
        <MemoizedHeroSection />
        <MemoizedFavoritesSection />
        <MemoizedCategoryTabs 
          categories={categoriesData} 
          activeCategory={activeCategory} 
          setActiveCategory={handleCategoryChange} 
        />
        <MemoizedProductGrid categoryId={activeCategory} />
        <MemoizedSubscription />
      </main>
      
      <MemoizedFooter />
      <Cart />
    </div>
  );
}