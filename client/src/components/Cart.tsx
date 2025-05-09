import { useState, useMemo, useCallback, memo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import WhatsAppModal from "./WhatsAppModal";
import { motion, AnimatePresence } from "framer-motion";
import { CartItem } from "@/lib/data";

export default function Cart() {
  const { t, language } = useLanguage();
  const { cartItems, isCartOpen, toggleCart, removeFromCart, updateCartItemQuantity } = useCart();
  
  const [notes, setNotes] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("11:00");
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  
  // Calculate totals - memorizziamo per evitare ricalcoli inutili
  const cartCalculations = useMemo(() => {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const vat = subtotal * 0.22;
    const discount = 0; // Could be calculated based on loyalty level
    const total = subtotal + vat - discount;
    
    return {
      subtotal,
      vat,
      discount,
      total
    };
  }, [cartItems]);
  
  // Get product name for current language - memorizziamo la funzione
  const getProductName = useCallback((item: CartItem) => {
    switch(language) {
      case 'it': return item.product.nameIt;
      case 'en': return item.product.nameEn;
      case 'es': return item.product.nameEs;
      case 'nl': return item.product.nameEn; // Fallback to English for Dutch (as we don't have Dutch translations for products yet)
      default: return item.product.nameEn;
    }
  }, [language]);
  
  // Get product description for current language - memorizziamo la funzione
  const getProductDescription = useCallback((item: CartItem) => {
    switch(language) {
      case 'it': return item.product.descriptionIt;
      case 'en': return item.product.descriptionEn;
      case 'es': return item.product.descriptionEs;
      case 'nl': return item.product.descriptionEn; // Fallback to English for Dutch
      default: return item.product.descriptionEn;
    }
  }, [language]);
  
  // Format as currency - memorizziamo la funzione
  const formatCurrency = useCallback((amount: number) => {
    return `€${amount.toFixed(2)}`;
  }, []);
  
  return (
    <>
      <AnimatePresence>
        {isCartOpen && (
          <motion.div 
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-full md:w-96 bg-white shadow-xl z-50 overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">{t('cart.title')}</h2>
                <button onClick={toggleCart} className="text-gray-500 hover:text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mb-6">
                {cartItems.length === 0 ? (
                  <div className="text-center py-8">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <p className="text-gray-500">{t('cart.empty')}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cartItems.map(item => (
                      <div key={item.product.id} className="cart-item flex border-b pb-4">
                        <img 
                          src={item.product.imageUrl} 
                          alt={getProductName(item)} 
                          className="w-20 h-20 object-cover rounded"
                        />
                        <div className="ml-4 flex-grow">
                          <div className="flex justify-between">
                            <h4 className="font-medium">{getProductName(item)}</h4>
                            <button 
                              onClick={() => removeFromCart(item.product.id)}
                              className="text-gray-400 hover:text-red-500"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </div>
                          <p className="text-sm text-gray-500 mb-2">{getProductDescription(item).substring(0, 30)}...</p>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center border rounded">
                              <button 
                                className="px-2 py-1 text-gray-500"
                                onClick={() => updateCartItemQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                              >
                                -
                              </button>
                              <span className="px-2">{item.quantity}</span>
                              <button 
                                className="px-2 py-1 text-gray-500"
                                onClick={() => updateCartItemQuantity(item.product.id, item.quantity + 1)}
                              >
                                +
                              </button>
                            </div>
                            <span className="font-semibold">{formatCurrency(item.product.price * item.quantity)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {cartItems.length > 0 && (
                <>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('cart.notes')}
                    </label>
                    <textarea 
                      className="w-full p-2 border border-gray-300 rounded-md h-20 text-sm" 
                      placeholder={t('cart.placeholder.notes')}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    ></textarea>
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('cart.time')}
                    </label>
                    <select
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={deliveryTime}
                      onChange={(e) => setDeliveryTime(e.target.value)}
                    >
                      <option value="11:00">11:00</option>
                      <option value="17:00">17:00</option>
                    </select>
                  </div>
                  
                  <div className="border-t border-b py-4 space-y-2 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{t('cart.subtotal')}</span>
                      <span>{formatCurrency(cartCalculations.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{t('cart.vat')}</span>
                      <span>{formatCurrency(cartCalculations.vat)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-green-600">
                      <span>{t('cart.discount')}</span>
                      <span>-{formatCurrency(cartCalculations.discount)}</span>
                    </div>
                    <div className="flex justify-between font-bold pt-2">
                      <span>{t('cart.total')}</span>
                      <span>{formatCurrency(cartCalculations.total)}</span>
                    </div>
                  </div>
                  
                  <motion.button 
                    className="bg-green-600 hover:bg-green-700 text-white w-full py-3 rounded-lg font-bold flex items-center justify-center shadow-md"
                    onClick={() => setShowWhatsAppModal(true)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                      <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                    </svg>
                    {t('cart.pay')}
                  </motion.button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <WhatsAppModal 
        isOpen={showWhatsAppModal} 
        onClose={() => setShowWhatsAppModal(false)}
        cartItems={cartItems}
        total={cartCalculations.total}
        time={deliveryTime}
        notes={notes}
      />
    </>
  );
}
