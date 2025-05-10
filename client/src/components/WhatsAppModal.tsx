import { useLanguage } from "@/contexts/LanguageContext";
import { CartItem } from "@/lib/data";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/contexts/CartContext";
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
  
  // Generate order message
  const generateOrderMessage = () => {
    // Titolo dell'ordine
    const orderTitle = `ORDINE DIONISO\n`;
    
    // Aggiunge il numero d'ordine 
    const orderInfo = `Ordine #${orderNumber}\n\n`;
    
    const itemsText = cartItems.map(item => 
      `${item.quantity}x ${getProductName(item)} (${formatCurrency(item.product.price)})`
    ).join('\n');
    
    const totalText = `\n${t('cart.total')}: ${formatCurrency(total)}`;
    const deliveryText = `\n${t('whatsapp.delivery', { time })}`;
    const notesText = notes ? `\n${t('cart.notes')}: ${notes}` : '';
    
    // Aggiungi timestamp
    const timestamp = `\nOrdinato: ${new Date().toLocaleString()}`;
    
    return encodeURIComponent(orderTitle + orderInfo + itemsText + totalText + deliveryText + notesText + timestamp);
  };
  
  // Chef phone number for SMS
  const phoneNumber = "31619311373"; // Sostituisci con il numero reale se necessario
  const smsUrl = `sms:${phoneNumber}?body=${generateOrderMessage()}`;
  
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
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Conferma il tuo ordine</h3>
              <p className="text-gray-500 text-sm mt-1">Completa il pagamento via SMS</p>
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
            
            <div className="flex space-x-3">
              <button 
                onClick={onClose}
                className="flex-1 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium"
              >
                {t('whatsapp.cancel')}
              </button>
              <a 
                href={smsUrl}
                className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-medium text-center hover:bg-blue-700 transition shadow-md"
                onClick={() => {
                  // Completa l'ordine pulendo il carrello e chiudendo il modale
                  setTimeout(() => {
                    clearCart();
                    onClose();
                    toggleCart();
                    
                    // Mostra un toast di conferma
                    toast({
                      title: t('cart.orderSuccess'),
                      description: t('cart.orderSuccessMessage'),
                      variant: "default",
                    });
                  }, 500);
                }}
              >
                Invia SMS
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}