import { useLanguage } from "@/contexts/LanguageContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { getProductById } from "@/lib/data";
import { memo, useMemo } from "react";
import ProductCard from "./ProductCard";
import { motion } from "framer-motion";

function FavoritesSection() {
  const { t } = useLanguage();
  const { favorites } = useFavorites();
  
  // Recuperiamo i prodotti preferiti
  const favoriteProducts = useMemo(() => {
    return favorites
      .map(id => getProductById(id))
      .filter((product): product is NonNullable<typeof product> => product !== undefined);
  }, [favorites]);
  
  // Se non ci sono preferiti, mostriamo un messaggio
  if (favoriteProducts.length === 0) {
    return null;
  }
  
  return (
    <section className="favorites-section mb-12">
      <div className="container mx-auto px-4">
        <h3 className="text-2xl font-bold text-fisher-blue-dark mb-6">
          {t('favorites.title')}
        </h3>
        
        {favoriteProducts.length === 0 ? (
          <p className="text-gray-500 text-center py-6">
            {t('favorites.empty')}
          </p>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            {favoriteProducts.map(product => (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}

export default memo(FavoritesSection);