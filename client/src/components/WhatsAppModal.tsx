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
  
  // Stato per le informazioni di contatto
  const [orderNumber, setOrderNumber] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  
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
    
    // Aggiunge numero d'ordine e info cliente
    const orderInfo = `*Ordine #${orderNumber}*\n`;
    const customerInfo = customerName ? `Nome: ${customerName}\n` : '';
    const emailInfo = customerEmail ? `Email: ${customerEmail}\n\n` : '\n';
    
    const itemsText = cartItems.map(item => 
      `${item.quantity}x ${getProductName(item)} - ${formatCurrency(item.product.price * item.quantity)}`
    ).join('\n');
    
    const totalText = `\n${t('cart.total')}: ${formatCurrency(total)}`;
    const deliveryText = `\n${t('whatsapp.delivery', { time })}`;
    const notesText = notes ? `\n${t('cart.notes')}: ${notes}` : '';
    
    return encodeURIComponent(orderInfo + customerInfo + emailInfo + message + itemsText + totalText + deliveryText + notesText);
  };
  
  // WhatsApp phone number
  const phoneNumber = "31619311373";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${generateWhatsAppMessage()}`;
  
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
              <p className="text-sm font-medium mb-2 text-fisher-blue-dark">Informazioni per l'ordine #{orderNumber}</p>
              
              <div className="space-y-3">
                <div>
                  <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                  <input 
                    type="text" 
                    id="customerName"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-fisher-accent focus:border-fisher-accent"
                    placeholder="Inserisci il tuo nome"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </div>
                
                <div>
                  <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input 
                    type="email" 
                    id="customerEmail"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-fisher-accent focus:border-fisher-accent"
                    placeholder="Inserisci la tua email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                  />
                </div>
              </div>
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
              {customerName ? (
                <a 
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 bg-green-600 text-white rounded-lg font-medium text-center hover:bg-green-700 transition shadow-md"
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
                  {t('whatsapp.open')}
                </a>
              ) : (
                <button
                  className="flex-1 py-2 bg-gray-400 text-white rounded-lg font-medium text-center cursor-not-allowed"
                  disabled
                  title="Inserisci il tuo nome per continuare"
                >
                  {t('whatsapp.open')}
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
