import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { Product } from "@/lib/data";
import { motion } from "framer-motion";
import { memo, useMemo, useCallback } from "react";
import { Heart } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  const { language, t } = useLanguage();
  const { addToCart } = useCart();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  
  // Memorizziamo il nome e la descrizione del prodotto nella lingua corrente
  const productTexts = useMemo(() => {
    let name, description;
    
    // Get name for current language
    if (language === 'it') name = product.nameIt;
    else if (language === 'en') name = product.nameEn;
    else if (language === 'es') name = product.nameEs;
    else if (language === 'nl') name = product.nameEn; // Per l'olandese usiamo English
    else name = product.nameEn; // Default to English
    
    // Get description for current language
    if (language === 'it') description = product.descriptionIt;
    else if (language === 'en') description = product.descriptionEn;
    else if (language === 'es') description = product.descriptionEs;
    else if (language === 'nl') description = product.descriptionEn; // Per l'olandese usiamo English
    else description = product.descriptionEn; // Default to English
    
    return { name, description };
  }, [product, language]);
  
  // Format price - memorizziamo per evitare ricalcoli
  const formattedPrice = useMemo(() => 
    `€${product.price.toFixed(2)}`, 
    [product.price]
  );
  
  // Memorizziamo la funzione per evitare render inutili
  const handleAddToCart = useCallback(() => {
    addToCart(product);
  }, [addToCart, product]);
  
  // Gestione dei preferiti
  const isProductFavorite = useMemo(() => isFavorite(product.id), [isFavorite, product.id]);
  
  const toggleFavorite = useCallback(() => {
    if (isProductFavorite) {
      removeFavorite(product.id);
    } else {
      addFavorite(product.id);
    }
  }, [isProductFavorite, addFavorite, removeFavorite, product.id]);
  
  // Memorizziamo il componente badge
  const PopularBadge = useMemo(() => {
    if (!product.isPopular) return null;
    return (
      <span className="bg-fisher-gold text-white text-xs px-2 py-1 rounded">
        {t('product.popular')}
      </span>
    );
  }, [product.isPopular, t]);
  
  // Memorizziamo il componente vegetarian badge
  const VegetarianBadge = useMemo(() => {
    if (!product.isVegetarian) return null;
    return (
      <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">
        {t('product.veggie')}
      </span>
    );
  }, [product.isVegetarian, t]);
  
  // Memorizziamo il pulsante di personalizzazione
  const CustomizeButton = useMemo(() => {
    if (!product.isCustomizable) return null;
    return (
      <button 
        className="customize-product mr-2 text-fisher-blue underline text-sm"
        onClick={() => {/* Implement customization logic */}}
      >
        {t('product.customize')}
      </button>
    );
  }, [product.isCustomizable, t]);
  
  return (
    <motion.div 
      className="product-card bg-white rounded-xl shadow-md overflow-hidden relative"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <img 
        src={product.imageUrl} 
        alt={productTexts.name} 
        className="w-full h-48 object-cover"
        loading="lazy" // Aggiungiamo lazy loading per le immagini
      />
      <button 
        className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white transition-colors z-10"
        onClick={toggleFavorite}
        title={isProductFavorite ? t('favorites.remove') : t('favorites.add')}
      >
        <Heart 
          size={20} 
          className={isProductFavorite ? "fill-red-500 text-red-500" : "text-gray-400"} 
        />
      </button>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h4 className="text-lg font-semibold">{productTexts.name}</h4>
          <div className="flex gap-1">
            {PopularBadge}
            {VegetarianBadge}
          </div>
        </div>
        <p className="text-gray-600 text-sm mb-3">{productTexts.description}</p>
        <div className="flex justify-between items-center">
          <span className="font-bold text-fisher-blue-dark">{formattedPrice}</span>
          <div className="flex items-center">
            {CustomizeButton}
            <motion.button 
              className="add-to-cart px-3 py-1.5 bg-fisher-blue text-white rounded-md hover:bg-fisher-blue-dark transition"
              onClick={handleAddToCart}
              whileTap={{ scale: 1.1 }}
              transition={{ duration: 0.2 }}
            >
              {t('product.add')}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Esportiamo un componente memorizzato per evitare re-render inutili
export default memo(ProductCard);
