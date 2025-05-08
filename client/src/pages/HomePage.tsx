import { useState } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import CategoryTabs from "@/components/CategoryTabs";
import ProductGrid from "@/components/ProductGrid";
import Subscription from "@/components/Subscription";
import Footer from "@/components/Footer";
import Cart from "@/components/Cart";
import { categories } from "@/lib/data";

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState(1); // Default to first category
  
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Header />
      
      <main className="container mx-auto px-4 py-6 flex-grow">
        <HeroSection />
        <CategoryTabs 
          categories={categories} 
          activeCategory={activeCategory} 
          setActiveCategory={setActiveCategory} 
        />
        <ProductGrid categoryId={activeCategory} />
        <Subscription />
      </main>
      
      <Footer />
      <Cart />
    </div>
  );
}