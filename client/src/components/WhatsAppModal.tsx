import { useLanguage } from "@/contexts/LanguageContext";
import { CartItem } from "@/lib/data";
import { motion, AnimatePresence } from "framer-motion";

interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  total: number;
  floor: string;
  time: string;
  notes: string;
}

export default function WhatsAppModal({ isOpen, onClose, cartItems, total, floor, time, notes }: WhatsAppModalProps) {
  const { t, language } = useLanguage();
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return `€${amount.toFixed(2)}`;
  };
  
  // Get product name for current language
  const getProductName = (item: CartItem) => {
    return language === 'it' ? item.product.nameIt : 
           language === 'en' ? item.product.nameEn : 
           item.product.nameEs;
  };
  
  // Generate WhatsApp message
  const generateWhatsAppMessage = () => {
    const message = `${t('whatsapp.message')}\n\n`;
    const itemsText = cartItems.map(item => 
      `${item.quantity}x ${getProductName(item)} - ${formatCurrency(item.product.price * item.quantity)}`
    ).join('\n');
    
    const totalText = `\n${t('cart.total')}: ${formatCurrency(total)}`;
    const deliveryText = `\n${t('whatsapp.delivery', { floor, time })}`;
    const notesText = notes ? `\n${t('cart.notes')}: ${notes}` : '';
    
    return encodeURIComponent(message + itemsText + totalText + deliveryText + notesText);
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
              
              <p className="text-sm mt-3 text-gray-700">{t('whatsapp.delivery', { floor, time })}</p>
              
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
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2 bg-green-600 text-white rounded-lg font-medium text-center hover:bg-green-700 transition shadow-md"
              >
                {t('whatsapp.open')}
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
