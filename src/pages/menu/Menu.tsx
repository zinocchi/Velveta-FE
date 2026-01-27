import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MenuSidebar from "../../components/menu/MenuSidebar";
import menuService from "../../services/MenuServices";
import type { Menu } from "../../types/index";
import "../../styles/Menu.css";

const CATEGORY_INFO = {
  // Drinks
  hot_coffee: {
    displayName: "Hot Coffee",
    description: "Rich, aromatic coffee served hot",
    image:
      "https://globalassets.starbucks.com/digitalassets/products/bev/CaffeLatte.jpg",
    section: "drinks" as const,
  },
  cold_coffee: {
    displayName: "Cold Coffee",
    description: "Refreshing iced coffee creations",
    image:
      "https://globalassets.starbucks.com/digitalassets/products/bev/VanillaSweetCreamColdBrew.jpg",
    section: "drinks" as const,
  },
  hot_tea: {
    displayName: "Hot Tea",
    description: "Soothing herbal and classic teas",
    image:
      "https://globalassets.starbucks.com/digitalassets/products/bev/HoneyCitrusMintTea.jpg",
    section: "drinks" as const,
  },
  cold_tea: {
    displayName: "Cold Tea",
    description: "Refreshing iced tea varieties",
    image:
      "https://globalassets.starbucks.com/digitalassets/products/bev/IcedBlackTea.jpg",
    section: "drinks" as const,
  },
  hot_chocolate: {
    displayName: "Hot Chocolate",
    description: "Creamy and indulgent hot chocolate",
    image:
      "https://globalassets.starbucks.com/digitalassets/products/bev/HotChocolate.jpg",
    section: "drinks" as const,
  },
  // Food
  bakery: {
    displayName: "Bakery",
    description: "Freshly baked pastries and breads",
    image:
      "https://globalassets.starbucks.com/digitalassets/products/food/SBX20210915_Croissant-onGreen.jpg",
    section: "food" as const,
  },
  treats: {
    displayName: "Treats",
    description: "Sweet indulgences for any time",
    image:
      "https://globalassets.starbucks.com/digitalassets/products/food/SBX20181129_BirthdayCakePop.jpg",
    section: "food" as const,
  },
  lunch: {
    displayName: "Lunch",
    description: "Satisfying midday meals",
    image:
      "https://globalassets.starbucks.com/digitalassets/products/food/SBX20220207_GrilledCheeseOnSourdough_US.jpg",
    section: "food" as const,
  },
  breakfast: {
    displayName: "Breakfast",
    description: "Hearty morning options",
    image:
      "https://globalassets.starbucks.com/digitalassets/products/food/SBX20190814_AvocadoSpread.jpg?impolicy=1by1_medium_630",
    section: "food" as const,
  },
};

const Menu = () => {
  const [menuData, setMenuData] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [groupedCategories, setGroupedCategories] = useState<
    Record<string, Menu[]>
  >({});

  useEffect(() => {
    fetchMenuData();
  }, []);

  useEffect(() => {
    // Animation for menu items
    const menuItems = document.querySelectorAll(".menu-page-item");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100", "translate-y-0");
          }
        });
      },
      { threshold: 0.1 },
    );

    menuItems.forEach((item) => {
      item.classList.add(
        "opacity-0",
        "translate-y-6",
        "transition-all",
        "duration-700",
      );
      observer.observe(item);
    });

    // Cleanup
    return () => {
      observer.disconnect();
    };
  }, []);

  const fetchMenuData = async () => {
    try {
      setLoading(true);
      const data = await menuService.getAllMenu();
      console.log("Fetched menu data:", data); // Debug log

      setMenuData(data);

      const grouped = data.reduce((acc: Record<string, Menu[]>, menu) => {
        const category = menu.category?.trim() || "uncategorized";
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(menu);
        return acc;
      }, {});

      console.log("Grouped categories:", Object.keys(grouped)); // Debug log
      setGroupedCategories(grouped);
    } catch (error) {
      console.error("Error fetching menu data:", error);
    } finally {
      setLoading(false);
    }
  };

  const drinkCategories = Object.keys(groupedCategories).filter(
    (category) =>
      CATEGORY_INFO[category as keyof typeof CATEGORY_INFO]?.section ===
      "drinks",
  );

  const foodCategories = Object.keys(groupedCategories).filter(
    (category) =>
      CATEGORY_INFO[category as keyof typeof CATEGORY_INFO]?.section === "food",
  );

  console.log("Drink categories:", drinkCategories);
  console.log("Food categories:", foodCategories);

  if (loading) {
    return (
      <main className="pt-28 pb-16 max-w-7xl mx-auto px-4">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-700"></div>
          <p className="mt-4 text-gray-600">Loading menu...</p>
        </div>
      </main>
    );
  }

  // Helper function to get category info
  const getCategoryInfo = (category: string) => {
    const info = CATEGORY_INFO[category as keyof typeof CATEGORY_INFO];
    if (info) return info;

    // Fallback for unknown categories
    return {
      displayName: category
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" "),
      description: `${groupedCategories[category]?.length || 0} items available`,
      image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085",
      section: "food" as const, // default to food
    };
  };

  const renderCategoryCard = (category: string) => {
    const info = getCategoryInfo(category);
    const menu = groupedCategories[category] || [];

    return (
      <Link
        key={category}
        to={`/category/${category}`} // buat route baru di React
        state={{
          category,
          menu,
          displayName: info.displayName,
        }}
        className="menu-page-item group"
      >
        <div className="bg-white rounded-xl shadow-sm overflow-hidden p-4 h-full flex flex-col hover:shadow-md transition-shadow duration-300">
          <div className="relative overflow-hidden rounded-lg mb-4">
            <img
              src={info.image}
              alt={info.displayName}
              className="menu-img w-full h-40 sm:h-48 object-cover rounded-lg"
            />
            {/* <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute top-2 right-2 bg-red-700 text-white text-xs font-bold px-2 py-1 rounded-full">
              {menu.length} items
            </div> */}
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {info.displayName}
          </h3>
          <p className="text-gray-600 text-sm">{info.description}</p>
        </div>
      </Link>
    );
  };

  return (
    <main className="pt-12 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row">
        <div className="flex-1 pt-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 font-montserrat">
            Our Menu
          </h1>
          <p className="text-gray-600 mb-8">
            Discover our premium selection of coffees and delicious food
            pairings
          </p>

          {/* Total categories debug */}
          {/* <div className="mb-4 text-sm text-gray-500">
            Total categories found: {Object.keys(groupedCategories).length}
          </div> */}

          {/* Drinks Section */}
          {drinkCategories.length > 0 && (
            <section id="drinks" className="mb-16">
              <h2 className="category-title text-2xl md:text-3xl font-bold text-gray-900 mb-8 font-montserrat">
                Drinks
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {drinkCategories.map(renderCategoryCard)}
              </div>
            </section>
          )}

          {/* Food Section */}
          {foodCategories.length > 0 && (
            <section id="food" className="mb-16">
              <h2 className="category-title text-2xl md:text-3xl font-bold text-gray-900 mb-8 font-montserrat">
                Food
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {foodCategories.map(renderCategoryCard)}
              </div>
            </section>
          )}

          {/* Show categories not mapped */}
          {Object.keys(groupedCategories).length > 0 &&
            drinkCategories.length === 0 &&
            foodCategories.length === 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  All Categories
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Object.keys(groupedCategories).map(renderCategoryCard)}
                </div>
              </div>
            )}

          {/* Empty State */}
          {Object.keys(groupedCategories).length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <p className="text-gray-600">No menu categories available.</p>
              <button
                onClick={fetchMenuData}
                className="mt-4 px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800"
              >
                Retry
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Menu;
