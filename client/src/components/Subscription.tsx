import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { MenuPreference, DeliveryTime } from "@/lib/data";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

// Dialog modale che si apre quando si richiede un abbonamento
function SubscriptionWhatsAppModal({ 
  isOpen, 
  onClose, 
  menuPreference,
  preferredTime
}: { 
  isOpen: boolean;
  onClose: () => void;
  menuPreference: MenuPreference;
  preferredTime: DeliveryTime;
}) {
  const { t } = useLanguage();
  const { toast } = useToast();
  
  // Genera un numero di abbonamento casuale
  const subscriptionNumber = Math.floor(10000 + Math.random() * 90000);
  
  // Genera il messaggio per WhatsApp
  const generateWhatsAppMessage = () => {
    const preferenceName = 
      menuPreference === 'vegetarian' 
        ? t('subscription.menuType.vegetarian')
        : menuPreference === 'halal' 
          ? t('subscription.menuType.halal') 
          : t('subscription.menuType.standard');
    
    const subscriptionInfo = `*${t('subscription.title')} #${subscriptionNumber}*\n\n`;
    
    const message = `
- ${t('subscription.preference')}: ${preferenceName}
- ${t('subscription.days')}: ${t('subscription.day.mon')}-${t('subscription.day.fri')}
- ${t('subscription.time')}: ${preferredTime}
- 5 panini + 5 bevande incluse
- ${t('subscription.price')}: €55/settimana (${t('subscription.benefit1')})`;
    
    return encodeURIComponent(subscriptionInfo + message);
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
              <h3 className="text-xl font-bold">{t('subscription.title')}</h3>
              <p className="text-gray-600 mt-2">{t('whatsapp.subtitle')}</p>
            </div>
            
            <div>
              <div className="bg-gray-100 rounded-lg p-4 mb-4">
                <p className="text-sm font-bold text-fisher-blue-dark">
                  {t('subscription.title')} #{subscriptionNumber}
                </p>
                <p className="text-sm mt-2">
                  {t('subscription.preference')}: {
                    menuPreference === 'vegetarian' 
                      ? t('subscription.menuType.vegetarian')
                      : menuPreference === 'halal' 
                        ? t('subscription.menuType.halal') 
                        : t('subscription.menuType.standard')
                  }
                </p>
                <p className="text-sm mt-1">
                  {t('subscription.days')}: {t('subscription.day.mon')}-{t('subscription.day.fri')}
                </p>
                <p className="text-sm mt-1">
                  {t('subscription.time')}: {preferredTime}
                </p>
                
                <div className="h-px bg-gray-200 my-3"></div>
                
                <p className="text-sm font-bold mt-3 flex justify-between">
                  <span>{t('subscription.price')}:</span>
                  <span>€55/settimana</span>
                </p>
              </div>
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
                onClick={() => {
                  // Chiudi il modale
                  setTimeout(() => {
                    onClose();
                    
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
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function Subscription() {
  const { t } = useLanguage();
  
  // State per le preferenze dell'abbonamento
  const [menuPreference, setMenuPreference] = useState<MenuPreference>('standard');
  const [preferredTime, setPreferredTime] = useState<DeliveryTime>('11:00');
  
  // State per il modale di WhatsApp
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  
  // Funzione per inviare l'ordine dell'abbonamento tramite WhatsApp
  const requestSubscription = () => {
    setShowWhatsAppModal(true);
  };
  
  return (
    <>
      <section className="my-16 bg-gradient-to-r from-fisher-blue to-fisher-blue-dark rounded-xl overflow-hidden shadow-xl">
        <div className="md:flex">
          <div className="md:w-1/2 p-8 text-white">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">{t('subscription.title')}</h2>
            <p className="text-lg opacity-90 mb-6">{t('subscription.subtitle')}</p>
            
            <div className="mb-6">
              <p className="text-3xl font-bold mb-2">€55/settimana</p>
              <p className="bg-white/20 px-3 py-2 rounded-md inline-block text-md font-medium">5 panini + 5 bevande incluse</p>
              <p className="text-sm opacity-80 mt-2">Sconto del 15% sul prezzo standard</p>
            </div>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-fisher-gold mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>{t('subscription.benefit1')}</span>
              </div>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-fisher-gold mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>{t('subscription.benefit2')}</span>
              </div>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-fisher-gold mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>{t('subscription.benefit3')}</span>
              </div>
            </div>
          </div>
          
          <div className="md:w-1/2 bg-white p-8">
            <h3 className="text-xl font-semibold mb-4 text-fisher-blue">{t('subscription.customize')}</h3>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('subscription.preference')}</label>
              <select 
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-fisher-accent focus:border-fisher-accent"
                value={menuPreference}
                onChange={e => setMenuPreference(e.target.value as MenuPreference)}
              >
                <option value="standard">{t('subscription.menuType.standard')}</option>
                <option value="vegetarian">{t('subscription.menuType.vegetarian')}</option>
                <option value="halal">{t('subscription.menuType.halal')}</option>
              </select>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('subscription.days')}</label>
              <p className="text-gray-600 text-sm">{t('subscription.day.mon')}-{t('subscription.day.fri')} (5 giorni)</p>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('subscription.time')}</label>
              <div className="flex space-x-6">
                <div className="flex items-center">
                  <input 
                    type="radio" 
                    id="time-11" 
                    name="delivery-time" 
                    className="mr-2 h-4 w-4 border-gray-300 text-fisher-blue focus:ring-fisher-accent"
                    checked={preferredTime === '11:00'}
                    onChange={() => setPreferredTime('11:00')}
                  />
                  <label htmlFor="time-11" className="text-sm">11:00</label>
                </div>
                <div className="flex items-center">
                  <input 
                    type="radio" 
                    id="time-17" 
                    name="delivery-time" 
                    className="mr-2 h-4 w-4 border-gray-300 text-fisher-blue focus:ring-fisher-accent"
                    checked={preferredTime === '17:00'}
                    onChange={() => setPreferredTime('17:00')}
                  />
                  <label htmlFor="time-17" className="text-sm">17:00</label>
                </div>
              </div>
            </div>
            
            <motion.button 
              className="bg-fisher-gold hover:bg-yellow-400 text-fisher-blue-dark font-bold py-3 px-6 rounded-lg transition w-full"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={requestSubscription}
            >
              {t('subscription.activate')}
            </motion.button>
          </div>
        </div>
      </section>
      
      {/* Modale di WhatsApp per l'abbonamento */}
      <SubscriptionWhatsAppModal
        isOpen={showWhatsAppModal}
        onClose={() => setShowWhatsAppModal(false)}
        menuPreference={menuPreference}
        preferredTime={preferredTime}
      />
    </>
  );
}