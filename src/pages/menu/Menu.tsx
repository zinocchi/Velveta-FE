import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import MenuSidebar from "../../components/MenuSidebar";

const Menu = () => {
  const [activeCategory, setActiveCategory] = useState<string>("");

  // Reset active category on mount
  useEffect(() => {
    setActiveCategory("");
  }, []);

  const handleCategoryClick = useCallback((categoryId: string) => {
    setActiveCategory(categoryId);
  }, []);

  useEffect(() => {
    // Animation for menu items
    const menuItems = document.querySelectorAll('.menu-item');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0');
        }
      });
    }, { threshold: 0.1 });

    menuItems.forEach(item => {
      item.classList.add('opacity-0', 'translate-y-6', 'transition-all', 'duration-700');
      observer.observe(item);
    });

    // Track scroll untuk active category
    const categoryObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          if (id) {
            setActiveCategory(id);
          }
        }
      });
    }, {
      rootMargin: '-20% 0px -50% 0px',
      threshold: 0.1
    });

    // Observe semua category elements
    const allCategories = [...drinkCategories, ...foodCategories];
    allCategories.forEach(category => {
      const element = document.getElementById(category.id);
      if (element) {
        categoryObserver.observe(element);
      }
    });

    // Cleanup
    return () => {
      observer.disconnect();
      categoryObserver.disconnect();
    };
  }, []);

  const drinkCategories = [
    {
      id: "hot-coffee",
      name: "Hot Coffee",
      description: "Rich, aromatic coffee served hot",
      image: "https://globalassets.starbucks.com/digitalassets/products/bev/CaffeLatte.jpg",
      route: "/menu/drinks/hot-coffee"
    },
    {
      id: "cold-coffee",
      name: "Cold Coffee",
      description: "Refreshing iced coffee creations",
      image: "https://globalassets.starbucks.com/digitalassets/products/bev/VanillaSweetCreamColdBrew.jpg",
      route: "/menu/drinks/cold-coffee"
    },
    {
      id: "hot-tea",
      name: "Hot Tea",
      description: "Soothing herbal and classic teas",
      image: "https://globalassets.starbucks.com/digitalassets/products/bev/HoneyCitrusMintTea.jpg",
      route: "/menu/drinks/hot-tea"
    },
    {
      id: "cold-tea",
      name: "Cold Tea",
      description: "Refreshing iced tea varieties",
      image: "https://globalassets.starbucks.com/digitalassets/products/bev/IcedBlackTea.jpg",
      route: "/menu/drinks/cold-tea"
    },
    {
      id: "hot-chocolate",
      name: "Hot Chocolate & More",
      description: "Rich, creamy chocolate drinks",
      image: "https://globalassets.starbucks.com/digitalassets/products/bev/HotChocolate.jpg",
      route: "/menu/drinks/hot-chocolate"
    }
  ];

  const foodCategories = [
    {
      id: "breakfast",
      name: "Breakfast",
      description: "Morning favorites to start your day",
      image: "https://globalassets.starbucks.com/digitalassets/products/food/EggPestoMozzarellaSandwich.jpg",
      route: "/menu/food/breakfast"
    },
    {
      id: "bakery",
      name: "Bakery",
      description: "Freshly baked pastries and breads",
      image: "https://globalassets.starbucks.com/digitalassets/products/food/SBX20210915_Croissant-onGreen.jpg",
      route: "/menu/food/bakery"
    },
    {
      id: "treats",
      name: "Treats",
      description: "Sweet indulgences for any time",
      image: "https://globalassets.starbucks.com/digitalassets/products/food/SBX20181129_BirthdayCakePop.jpg",
      route: "/menu/food/treats"
    },
    {
      id: "lunch",
      name: "Lunch",
      description: "Satisfying midday meals",
      image: "https://globalassets.starbucks.com/digitalassets/products/food/SBX20220207_GrilledCheaseOnSourdough_US.jpg",
      route: "/menu/food/lunch"
    },
    {
      id: "snack",
      name: "Snacks",
      description: "Light bites and savory snacks",
      image: "https://globalassets.starbucks.com/digitalassets/products/food/SBX20190903_SmokedTurkeyProteinBox.jpg",
      route: "/menu/food/snack"
    }
  ];

  return (
    <main className="min-h-screen">
      {/* Hero/Header Section */}
      <div className="pt-24 pb-12 bg-gradient-to-r from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-montserrat">
              Our Menu
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our premium selection of coffees and delicious food pairings
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row">
          {/* Sidebar */}
          <div className="lg:w-1/4 mb-8 lg:mb-0 lg:pr-8">
            <MenuSidebar 
              activeCategory={activeCategory}
              onCategoryClick={handleCategoryClick}
            />
          </div>
          
          {/* Menu Content */}
          <div className="lg:w-3/4">
            {/* Drinks Section */}
            <section id="drinks" className="mb-16 scroll-mt-24">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 font-montserrat border-b pb-3">
                Drinks
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {drinkCategories.map((category) => (
                  <Link 
                    key={category.id}
                    to={category.route}
                    id={category.id}
                    className="menu-item group block"
                  >
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden h-full flex flex-col hover:shadow-lg transition-all duration-300 border border-gray-100">
                      <div className="relative overflow-hidden h-56">
                        <img 
                          src={category.image} 
                          alt={category.name}
                          className="menu-img w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "https://via.placeholder.com/400x300/E5E7EB/6B7280?text=" + encodeURIComponent(category.name);
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                      <div className="p-5 flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{category.name}</h3>
                        <p className="text-gray-600 mb-4">{category.description}</p>
                        <div className="text-red-700 font-medium text-sm flex items-center">
                          Explore
                          <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* Food Section */}
            <section id="food" className="mb-16 scroll-mt-24">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 font-montserrat border-b pb-3">
                Food
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {foodCategories.map((category) => (
                  <Link 
                    key={category.id}
                    to={category.route}
                    id={category.id}
                    className="menu-item group block"
                  >
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden h-full flex flex-col hover:shadow-lg transition-all duration-300 border border-gray-100">
                      <div className="relative overflow-hidden h-56">
                        <img 
                          src={category.image} 
                          alt={category.name}
                          className="menu-img w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "https://via.placeholder.com/400x300/E5E7EB/6B7280?text=" + encodeURIComponent(category.name);
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                      <div className="p-5 flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{category.name}</h3>
                        <p className="text-gray-600 mb-4">{category.description}</p>
                        <div className="text-red-700 font-medium text-sm flex items-center">
                          Explore
                          <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Menu;