import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";

export default function LoyaltyProgram() {
  const { t } = useLanguage();
  const { user } = useAuth();
  
  // Loyalty progress calculation
  const totalPoints = user?.loyaltyPoints || 320; // Default for demo
  const currentLevel = user?.loyaltyLevel || 'silver'; // Default for demo
  
  // Calculate points to next level
  let maxPoints = 500;
  let pointsToNext = 0;
  
  if (currentLevel === 'bronze') {
    maxPoints = 250;
    pointsToNext = Math.max(0, maxPoints - totalPoints);
  } else if (currentLevel === 'silver') {
    maxPoints = 500;
    pointsToNext = Math.max(0, maxPoints - totalPoints);
  }
  
  // Calculate progress percentage
  const progressPercentage = Math.min(100, (totalPoints / maxPoints) * 100);
  
  return (
    <section className="mb-16">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">{t('loyalty.title')}</h2>
      
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 md:p-8">
          <div className="md:flex items-start">
            <div className="md:w-1/3 mb-6 md:mb-0 md:pr-8">
              <div className="bg-gradient-to-br from-fisher-blue to-fisher-blue-dark text-white p-6 rounded-lg shadow-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">
                    {t('loyalty.level', { level: t(`loyalty.level.${currentLevel}`) })}
                  </h3>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-fisher-gold" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.504 1.132a1 1 0 01.992 0l1.75 1a1 1 0 11-.992 1.736L10 3.152l-1.254.716a1 1 0 11-.992-1.736l1.75-1zM5.618 4.504a1 1 0 01-.372 1.364L5.016 6l.23.132a1 1 0 11-.992 1.736L4 7.723V8a1 1 0 01-2 0V6a.996.996 0 01.52-.878l1.734-.99a1 1 0 011.364.372zm8.764 0a1 1 0 011.364-.372l1.733.99A1.002 1.002 0 0118 6v2a1 1 0 11-2 0v-.277l-.254.145a1 1 0 11-.992-1.736l.23-.132-.23-.132a1 1 0 01-.372-1.364zm-7 4a1 1 0 011.364-.372L10 8.848l1.254-.716a1 1 0 11.992 1.736L11 10.58V12a1 1 0 11-2 0v-1.42l-1.246-.712a1 1 0 01-.372-1.364zM3 11a1 1 0 011 1v1.42l1.246.712a1 1 0 11-.992 1.736l-1.75-1A1 1 0 012 14v-2a1 1 0 011-1zm14 0a1 1 0 011 1v2a1 1 0 01-.504.868l-1.75 1a1 1 0 11-.992-1.736L16 13.42V12a1 1 0 011-1zm-9.618 5.504a1 1 0 011.364-.372l.254.144V16a1 1 0 112 0v.277l.254-.145a1 1 0 11.992 1.736l-1.735.992a.995.995 0 01-1.022 0l-1.735-.992a1 1 0 01-.372-1.364z" clipRule="evenodd" />
                  </svg>
                </div>
                
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-1">
                    <span>{t('loyalty.points')}</span>
                    <span className="font-semibold">{totalPoints} / {maxPoints}</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2.5 shadow-inner">
                    <div 
                      className="bg-fisher-gold h-2.5 rounded-full shadow-sm" 
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                  <div className="text-xs mt-1 text-white/90">
                    {t('loyalty.pointsToNext', { points: pointsToNext })}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">{t('loyalty.next')}</h4>
                  <div className="bg-fisher-blue-dark/70 p-4 rounded-lg border border-white/10 shadow-sm flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-fisher-gold mr-3" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 110 4h-5V9a1 1 0 10-2 0v1H4a2 2 0 110-4h1.17C5.06 5.687 5 5.35 5 5zm4 1V5a1 1 0 10-1 1h1zm3 0a1 1 0 10-1-1v1h1z" clipRule="evenodd" />
                      <path d="M9 11H3v5a2 2 0 002 2h4v-7zM11 18h4a2 2 0 002-2v-5h-6v7z" />
                    </svg>
                    <div>
                      <p className="font-medium">{t('loyalty.reward.title')}</p>
                      <p className="text-sm text-fisher-accent">{t('loyalty.reward.points')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="md:w-2/3">
              <h3 className="text-xl font-semibold mb-4 text-fisher-blue">{t('loyalty.benefits')}</h3>
              
              <div className="space-y-6">
                <div className="flex">
                  <div className="w-24 text-center">
                    <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-1 
                      ${currentLevel === 'bronze' ? 'border-2 border-fisher-blue bg-yellow-700/20' : 'bg-gray-200'}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-700" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className={`text-sm font-medium ${currentLevel === 'bronze' ? 'text-fisher-blue' : ''}`}>
                      {t('loyalty.level.bronze')}
                    </p>
                  </div>
                  <div className="ml-4">
                    <p className="font-medium text-gray-800">{t('loyalty.bronze.points')}</p>
                    <ul className="text-sm text-gray-600 mt-1 space-y-1">
                      <li>• {t('loyalty.bronze.benefit1')}</li>
                      <li>• {t('loyalty.bronze.benefit2')}</li>
                    </ul>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="w-24 text-center">
                    <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-1
                      ${currentLevel === 'silver' ? 'border-2 border-fisher-blue bg-gray-300' : 'bg-gray-200'}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className={`text-sm font-medium ${currentLevel === 'silver' ? 'text-fisher-blue' : ''}`}>
                      {t('loyalty.level.silver')}
                    </p>
                  </div>
                  <div className="ml-4">
                    <p className="font-medium text-gray-800">{t('loyalty.silver.points')}</p>
                    <ul className="text-sm text-gray-600 mt-1 space-y-1">
                      <li>• {t('loyalty.silver.benefit1')}</li>
                      <li>• {t('loyalty.silver.benefit2')}</li>
                      <li>• {t('loyalty.silver.benefit3')}</li>
                    </ul>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="w-24 text-center">
                    <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-1
                      ${currentLevel === 'gold' ? 'border-2 border-fisher-blue bg-yellow-100' : 'bg-gray-200'}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className={`text-sm font-medium ${currentLevel === 'gold' ? 'text-fisher-blue' : ''}`}>
                      {t('loyalty.level.gold')}
                    </p>
                  </div>
                  <div className="ml-4">
                    <p className="font-medium text-gray-800">{t('loyalty.gold.points')}</p>
                    <ul className="text-sm text-gray-600 mt-1 space-y-1">
                      <li>• {t('loyalty.gold.benefit1')}</li>
                      <li>• {t('loyalty.gold.benefit2')}</li>
                      <li>• {t('loyalty.gold.benefit3')}</li>
                      <li>• {t('loyalty.gold.benefit4')}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
