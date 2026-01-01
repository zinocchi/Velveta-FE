import React, { useEffect } from "react";
import "../Menu.css";

interface MenuSidebarProps {
  activeCategory?: string;
  onCategoryClick?: (category: string) => void;
}

const MenuSidebar = ({ activeCategory, onCategoryClick }: MenuSidebarProps) => {
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

  useEffect(() => {
    // Check hash on mount
    const hash = window.location.hash.substring(1);
    if (hash && onCategoryClick) {
      onCategoryClick(hash);
    }
  }, [onCategoryClick]);

  const handleClick = (categoryId: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    // Update URL hash
    window.history.pushState(null, '', `#${categoryId}`);
    
    // Scroll to element
    const element = document.getElementById(categoryId);
    if (element) {
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - 120; // Adjust for navbar height
      
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
    return activeCategory === categoryId;
  };

  return (
    <aside className="w-full md:w-64 flex-shrink-0 mb-8 md:mb-0 md:mr-8">
      <div className="bg-white rounded-xl shadow-sm p-6 sticky top-32">
        <h2 className="font-bold text-xl text-gray-900 mb-6 font-montserrat">Categories</h2>
        
        {/* Drink Categories */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 font-montserrat">Drinks</h3>
          <ul className="space-y-2">
            {drinkCategories.map((category) => (
              <li key={category.id}>
                <button
                  type="button"
                  onClick={(e) => handleClick(category.id, e)}
                  className={`
                    w-full text-left
                    ${isActive(category.id) ? 'text-red-700 font-semibold' : 'text-gray-600'} 
                    hover:text-red-700 
                    block 
                    py-1 
                    transition-colors 
                    duration-300
                    relative
                    pl-4
                    focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-1 rounded
                  `}
                >
                  {category.label}
                  {isActive(category.id) && (
                    <span className="absolute left-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-red-700 rounded-full"></span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Food Categories */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3 font-montserrat">Food</h3>
          <ul className="space-y-2">
            {foodCategories.map((category) => (
              <li key={category.id}>
                <button
                  type="button"
                  onClick={(e) => handleClick(category.id, e)}
                  className={`
                    w-full text-left
                    ${isActive(category.id) ? 'text-red-700 font-semibold' : 'text-gray-600'} 
                    hover:text-red-700 
                    block 
                    py-1 
                    transition-colors 
                    duration-300
                    relative
                    pl-4
                    focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-1 rounded
                  `}
                >
                  {category.label}
                  {isActive(category.id) && (
                    <span className="absolute left-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-red-700 rounded-full"></span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Mobile View */}
        <div className="md:hidden mt-8 pt-6 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {[...drinkCategories, ...foodCategories].slice(0, 5).map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={(e) => handleClick(category.id, e)}
                className={`
                  px-3 py-1.5 text-sm rounded-full border transition-colors duration-300
                  ${isActive(category.id) 
                    ? 'bg-red-700 text-white border-red-700' 
                    : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
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