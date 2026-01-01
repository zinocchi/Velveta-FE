import React, { useEffect, useState } from "react";
import "../Menu.css";

interface MenuSidebarProps {
  activeCategory?: string;
  onCategoryClick?: (category: string) => void;
}

const MenuSidebar = ({ activeCategory, onCategoryClick }: MenuSidebarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentSection, setCurrentSection] = useState("");

  const drinkCategories = [
    { id: "hot-coffee", label: "Hot Coffee" },
    { id: "cold-coffee", label: "Cold Coffee" },
    { id: "hot-tea", label: "Hot Tea" },
    { id: "cold-tea", label: "Cold Tea" },
    { id: "hot-chocolate", label: "Hot Chocolate & More" }
  ];

  const foodCategories = [
    { id: "breakfast", label: "Breakfast" },
    { id: "bakery", label: "Bakery" },
    { id: "treats", label: "Treats" },
    { id: "lunch", label: "Lunch" },
    { id: "snack", label: "Snacks" }
  ];

  // Track scroll untuk efek shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      // Update current section berdasarkan scroll
      const sections = [...drinkCategories, ...foodCategories].map(cat => cat.id);
      let current = "";
      
      sections.forEach(sectionId => {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            current = sectionId;
          }
        }
      });
      
      if (current !== currentSection) {
        setCurrentSection(current);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentSection]);

  // Check hash on mount
  useEffect(() => {
    const hash = window.location.hash.substring(1);
    if (hash && onCategoryClick) {
      onCategoryClick(hash);    
    }
  }, [onCategoryClick]);

  const handleClick = (categoryId: string, event: React.MouseEvent) => {
    event.preventDefault();
    
    // Update URL hash
    window.history.pushState(null, '', `#${categoryId}`);
    setCurrentSection(categoryId);
    
    // Scroll to element
    const element = document.getElementById(categoryId);
    if (element) {
      const headerOffset = 120;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    
    if (onCategoryClick) {
      onCategoryClick(categoryId);
    }
  };

  const isActive = (categoryId: string) => {
    if (activeCategory) {
      return activeCategory === categoryId;
    }
    return currentSection === categoryId;
  };

  return (
    <aside className="w-full md:w-64 flex-shrink-0 mb-8 md:mb-0 md:mr-8">
      <div className={`
        bg-white rounded-xl p-6 sticky top-32 transition-shadow duration-300
        ${isScrolled ? 'shadow-lg' : 'shadow-sm'}
        hover:shadow-md
      `}>
        <h2 className="font-bold text-xl text-gray-900 mb-6 font-montserrat border-b pb-3">Categories</h2>
        
        {/* Drink Categories */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 font-montserrat">Drinks</h3>
          <ul className="space-y-1">
            {drinkCategories.map((category) => (
              <li key={category.id}>
                <button
                  type="button"
                  onClick={(e) => handleClick(category.id, e)}
                  className={`
                    w-full text-left py-2 px-3 rounded-lg transition-all duration-200
                    ${isActive(category.id) 
                      ? 'hover:text-red-700 block py-1 transition-colors duration-300' 
                      : 'text-gray-600 hover:text-red-700 hover:bg-gray-50 pl-3'
                    }
                    focus:outline-none focus:ring-1 focus:ring-red-300
                  `}
                >
                  {category.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Food Categories */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3 font-montserrat">Food</h3>
          <ul className="space-y-1">
            {foodCategories.map((category) => (
              <li key={category.id}>
                <button
                  type="button"
                  onClick={(e) => handleClick(category.id, e)}
                  className={`
                    w-full text-left py-2 px-3 rounded-lg transition-all duration-200
                    ${isActive(category.id) 
                      ? 'text-red-700 font-semibold bg-red-50 border-l-4 border-red-500 pl-2' 
                      : 'text-gray-600 hover:text-red-700 hover:bg-gray-50 pl-3'
                    }
                    focus:outline-none focus:ring-1 focus:ring-red-300
                  `}
                >
                  {category.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Mobile View */}
        <div className="md:hidden mt-8 pt-6 border-t border-gray-200">
          <div className="flex overflow-x-auto pb-2 space-x-2">
            {[...drinkCategories, ...foodCategories].slice(0, 6).map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={(e) => handleClick(category.id, e)}
                className={`
                  whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200
                  ${isActive(category.id) 
                    ? 'bg-red-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                  focus:outline-none focus:ring-2 focus:ring-red-300
                `}
              >
                {category.label.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default MenuSidebar;