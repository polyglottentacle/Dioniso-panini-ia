import { useLanguage } from "@/contexts/LanguageContext";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="language-selector flex space-x-2 text-sm">
      <button 
        className={`px-2 py-1 rounded transition ${language === 'it' ? 'bg-fisher-blue text-white' : 'hover:bg-fisher-gray'}`}
        onClick={() => setLanguage('it')}
      >
        🇮🇹 IT
      </button>
      <button 
        className={`px-2 py-1 rounded transition ${language === 'en' ? 'bg-fisher-blue text-white' : 'hover:bg-fisher-gray'}`}
        onClick={() => setLanguage('en')}
      >
        🇬🇧 EN
      </button>
      <button 
        className={`px-2 py-1 rounded transition ${language === 'es' ? 'bg-fisher-blue text-white' : 'hover:bg-fisher-gray'}`}
        onClick={() => setLanguage('es')}
      >
        🇪🇸 ES
      </button>
      <button 
        className={`px-2 py-1 rounded transition ${language === 'nl' ? 'bg-fisher-blue text-white' : 'hover:bg-fisher-gray'}`}
        onClick={() => setLanguage('nl')}
      >
        🇳🇱 NL
      </button>
    </div>
  );
}
