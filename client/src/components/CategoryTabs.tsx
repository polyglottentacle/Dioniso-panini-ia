import { useLanguage } from "@/contexts/LanguageContext";
import { Category } from "@/lib/data";

interface CategoryTabsProps {
  categories: Category[];
  activeCategory: number;
  setActiveCategory: (categoryId: number) => void;
}

export default function CategoryTabs({ categories, activeCategory, setActiveCategory }: CategoryTabsProps) {
  const { language } = useLanguage();
  
  return (
    <section className="mb-8">
      <div className="categories-tabs flex space-x-2 md:space-x-4 overflow-x-auto pb-2">
        {categories.map(category => {
          // Get appropriate name for current language
          const categoryName = language === 'it' ? category.nameIt : 
                               language === 'en' ? category.nameEn : 
                               category.nameEs;
          
          const isActive = category.id === activeCategory;
          
          return (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`category-tab whitespace-nowrap px-4 py-2 rounded-full font-medium transition
                ${isActive ? 'bg-fisher-blue text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
            >
              {categoryName}
            </button>
          );
        })}
      </div>
    </section>
  );
}
