import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { MenuPreference, WeekDay, DeliveryTime } from "@/lib/data";
import { motion } from "framer-motion";

export default function Subscription() {
  const { t } = useLanguage();
  
  // State for subscription preferences
  const [menuPreference, setMenuPreference] = useState<MenuPreference>('standard');
  const [preferredDays, setPreferredDays] = useState<WeekDay[]>([]);
  const [preferredTime, setPreferredTime] = useState<DeliveryTime>('11:00');
  
  // Handle checkbox toggle for days
  const toggleDay = (day: WeekDay) => {
    if (preferredDays.includes(day)) {
      setPreferredDays(preferredDays.filter(d => d !== day));
    } else {
      setPreferredDays([...preferredDays, day]);
    }
  };
  
  return (
    <section className="my-16 bg-gradient-to-r from-fisher-blue to-fisher-blue-dark rounded-xl overflow-hidden shadow-xl">
      <div className="md:flex">
        <div className="md:w-1/2 p-8 text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">{t('subscription.title')}</h2>
          <p className="text-lg opacity-90 mb-6">{t('subscription.subtitle')}</p>
          
          <div className="mb-6">
            <p className="text-3xl font-bold mb-2">{t('subscription.price')}</p>
            <p className="text-sm opacity-80">{t('subscription.meals')}</p>
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
          
          <motion.button 
            className="bg-fisher-gold hover:bg-yellow-500 text-fisher-blue font-bold py-3 px-6 rounded-lg transition w-full md:w-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {t('subscription.activate')}
          </motion.button>
        </div>
        
        <div className="md:w-1/2 bg-white p-8">
          <h3 className="text-xl font-semibold mb-4 text-fisher-blue">{t('subscription.customize')}</h3>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('subscription.preference')}</label>
            <select 
              className="w-full p-2 border border-gray-300 rounded-md"
              value={menuPreference}
              onChange={e => setMenuPreference(e.target.value as MenuPreference)}
            >
              <option value="standard">{t('subscription.menuType.standard')}</option>
              <option value="vegetarian">{t('subscription.menuType.vegetarian')}</option>
              <option value="halal">{t('subscription.menuType.halal')}</option>
              <option value="glutenFree">{t('subscription.menuType.glutenFree')}</option>
            </select>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('subscription.days')}</label>
            <div className="grid grid-cols-5 gap-2">
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="monday" 
                  className="mr-2"
                  checked={preferredDays.includes('mon')}
                  onChange={() => toggleDay('mon')}
                />
                <label htmlFor="monday">{t('subscription.day.mon')}</label>
              </div>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="tuesday" 
                  className="mr-2"
                  checked={preferredDays.includes('tue')}
                  onChange={() => toggleDay('tue')}
                />
                <label htmlFor="tuesday">{t('subscription.day.tue')}</label>
              </div>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="wednesday" 
                  className="mr-2"
                  checked={preferredDays.includes('wed')}
                  onChange={() => toggleDay('wed')}
                />
                <label htmlFor="wednesday">{t('subscription.day.wed')}</label>
              </div>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="thursday" 
                  className="mr-2"
                  checked={preferredDays.includes('thu')}
                  onChange={() => toggleDay('thu')}
                />
                <label htmlFor="thursday">{t('subscription.day.thu')}</label>
              </div>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="friday" 
                  className="mr-2"
                  checked={preferredDays.includes('fri')}
                  onChange={() => toggleDay('fri')}
                />
                <label htmlFor="friday">{t('subscription.day.fri')}</label>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('subscription.time')}</label>
            <div className="flex space-x-4">
              <div className="flex items-center">
                <input 
                  type="radio" 
                  id="time-11" 
                  name="delivery-time" 
                  className="mr-2"
                  checked={preferredTime === '11:00'}
                  onChange={() => setPreferredTime('11:00')}
                />
                <label htmlFor="time-11">11:00</label>
              </div>
              <div className="flex items-center">
                <input 
                  type="radio" 
                  id="time-17" 
                  name="delivery-time" 
                  className="mr-2"
                  checked={preferredTime === '17:00'}
                  onChange={() => setPreferredTime('17:00')}
                />
                <label htmlFor="time-17">17:00</label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
