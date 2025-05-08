import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { Product } from "@/lib/data";
import { motion } from "framer-motion";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { language, t } = useLanguage();
  const { addToCart } = useCart();
  
  // Get name and description for current language
  const productName = language === 'it' ? product.nameIt : 
                      language === 'en' ? product.nameEn : 
                      product.nameEs;
                      
  const productDescription = language === 'it' ? product.descriptionIt : 
                             language === 'en' ? product.descriptionEn : 
                             product.descriptionEs;
  
  // Format price
  const formattedPrice = `€${product.price.toFixed(2)}`;
  
  const handleAddToCart = () => {
    addToCart(product);
  };
  
  return (
    <motion.div 
      className="product-card bg-white rounded-xl shadow-md overflow-hidden"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <img 
        src={product.imageUrl} 
        alt={productName} 
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h4 className="text-lg font-semibold">{productName}</h4>
          {product.isPopular && (
            <span className="bg-fisher-gold text-white text-xs px-2 py-1 rounded">
              {t('product.popular')}
            </span>
          )}
          {product.isVegetarian && (
            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">
              {t('product.veggie')}
            </span>
          )}
        </div>
        <p className="text-gray-600 text-sm mb-3">{productDescription}</p>
        <div className="flex justify-between items-center">
          <span className="font-bold text-fisher-blue-dark">{formattedPrice}</span>
          <div className="flex items-center">
            {product.isCustomizable && (
              <button 
                className="customize-product mr-2 text-fisher-blue underline text-sm"
                onClick={() => {/* Implement customization logic */}}
              >
                {t('product.customize')}
              </button>
            )}
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
