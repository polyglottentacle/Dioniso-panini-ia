import { useLanguage } from "@/contexts/LanguageContext";
import { CartItem } from "@/lib/data";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/contexts/CartContext";
import { useAudioContext } from "@/contexts/AudioContext";
import { useAudio } from "@/hooks/use-audio";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  total: number;
  time: string;
  notes: string;
}

// Funzione per generare un numero d'ordine 
const generateOrderNumber = () => {
  const today = new Date();
  const day = today.getDate().toString().padStart(2, '0');
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const year = today.getFullYear().toString().slice(-2);
  const randomDigits = Math.floor(1000 + Math.random() * 9000); // Numero a 4 cifre
  
  return `${day}${month}${year}-${randomDigits}`;
};

export default function WhatsAppModal({ isOpen, onClose, cartItems, total, time, notes }: WhatsAppModalProps) {
  const { t, language } = useLanguage();
  const { clearCart, toggleCart } = useCart();
  const { soundEnabled, volume } = useAudioContext();
  const { playCheckout } = useAudio(soundEnabled, volume);
  const { toast } = useToast();
  
  // Stato per il numero d'ordine
  const [orderNumber, setOrderNumber] = useState("");
  
  // Genera un numero d'ordine quando il modale viene aperto
  useEffect(() => {
    if (isOpen) {
      setOrderNumber(generateOrderNumber());
    }
  }, [isOpen]);
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return `€${amount.toFixed(2)}`;
  };
  
  // Get product name for current language
  const getProductName = (item: CartItem) => {
    switch(language) {
      case 'it': return item.product.nameIt;
      case 'en': return item.product.nameEn;
      case 'es': return item.product.nameEs;
      case 'nl': return item.product.nameEn; // Fallback to English for Dutch (as we don't have Dutch translations for products yet)
      default: return item.product.nameEn;
    }
  };
  
  // Generate WhatsApp message
  const generateWhatsAppMessage = () => {
    const message = `${t('whatsapp.message')}\n\n`;
    
    // Aggiunge solo il numero d'ordine 
    const orderInfo = `*Ordine #${orderNumber}*\n\n`;
    
    const itemsText = cartItems.map(item => 
      `${item.quantity}x ${getProductName(item)} - ${formatCurrency(item.product.price * item.quantity)}`
    ).join('\n');
    
    const totalText = `\n${t('cart.total')}: ${formatCurrency(total)}`;
    const deliveryText = `\n${t('whatsapp.delivery', { time })}`;
    const notesText = notes ? `\n${t('cart.notes')}: ${notes}` : '';
    
    return encodeURIComponent(orderInfo + message + itemsText + totalText + deliveryText + notesText);
  };
  
  // WhatsApp phone number
  const phoneNumber = "31619311373";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${generateWhatsAppMessage()}`;
  const telegramUrl = `https://t.me/+31619311373?text=${generateWhatsAppMessage()}`;
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-xl max-w-md w-full p-6"
          >
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">{t('whatsapp.title')}</h3>
              <p className="text-gray-500 text-sm mt-1">{t('whatsapp.subtitle')}</p>
            </div>
            
            <div className="mb-4">
              <p className="text-sm font-medium mb-2 text-fisher-blue-dark">Ordine #{orderNumber}</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200 shadow-sm">
              <p className="text-sm font-medium mb-2">{t('whatsapp.message')}</p>
              
              {cartItems.map(item => (
                <p key={item.product.id} className="text-sm mt-2 flex justify-between">
                  <span>{item.quantity}x {getProductName(item)}</span>
                  <span className="font-medium">{formatCurrency(item.product.price * item.quantity)}</span>
                </p>
              ))}
              
              <div className="h-px bg-gray-200 my-3"></div>
              
              <p className="text-sm font-bold mt-3 flex justify-between">
                <span>{t('cart.total')}:</span>
                <span>{formatCurrency(total)}</span>
              </p>
              
              <p className="text-sm mt-3 text-gray-700">{t('whatsapp.delivery', { time })}</p>
              
              {notes && (
                <div className="mt-3 bg-white p-2 rounded border border-gray-100">
                  <p className="text-xs text-gray-500">{t('cart.notes')}:</p>
                  <p className="text-sm">{notes}</p>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              <button 
                onClick={onClose}
                className="py-2 border border-gray-300 rounded-lg text-gray-700 font-medium text-sm"
              >
                {t('whatsapp.cancel')}
              </button>
              <a 
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 bg-green-600 text-white rounded-lg font-medium text-center hover:bg-green-700 transition shadow-md text-sm"
                onClick={() => {
                  playCheckout();
                  setTimeout(() => {
                    clearCart();
                    onClose();
                    toggleCart();
                    toast({
                      title: t('cart.orderSuccess'),
                      description: t('cart.orderSuccessMessage'),
                      variant: "default",
                    });
                  }, 500);
                }}
              >
                WhatsApp
              </a>
              <a
                href={telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 bg-blue-500 text-white rounded-lg font-medium text-center hover:bg-blue-600 transition shadow-md text-sm"
                onClick={() => {
                  playCheckout();
                  setTimeout(() => {
                    clearCart();
                    onClose();
                    toggleCart();
                    toast({
                      title: t('cart.orderSuccess'),
                      description: t('telegram.orderSuccessMessage'),
                      variant: "default",
                    });
                  }, 500);
                }}
              >
                Telegram
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}