import { useLanguage } from "@/contexts/LanguageContext";

export default function HeroSection() {
  const { t } = useLanguage();
  
  return (
    <section className="hero-section mb-12">
      <div className="relative rounded-xl overflow-hidden shadow-xl h-64 md:h-96">
        <div className="absolute inset-0 bg-gradient-to-r from-fisher-blue/80 to-transparent z-10"></div>
        <img 
          src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=500" 
          alt="Italian gourmet food selection" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-12 z-20">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-3 max-w-xl leading-tight">
            {t('hero.title')}
          </h2>
          <p className="text-lg md:text-xl text-white/90 max-w-lg mb-3">
            {t('hero.subtitle')}
          </p>
          <div className="bg-white/90 p-3 rounded-lg mb-4 border border-fisher-accent max-w-md">
            <p className="text-md font-medium text-fisher-blue-dark flex items-center">
              <span className="mr-2">⏰</span>
              Ordina entro le 16:00, paga e ricevi alla tua prossima pausa il tuo menu!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
