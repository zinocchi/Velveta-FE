import { useEffect } from "react";
import { Link } from "react-router-dom";
import MenuSidebar from "../../components/MenuSidebar";

const Menu = () => {
  useEffect(() => {
    const menuItems = document.querySelectorAll(".menu-page-item");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100", "translate-y-0");
          }
        });
      },
      { threshold: 0.1 }
    );

    menuItems.forEach((item) => {
      item.classList.add(
        "opacity-0",
        "translate-y-6",
        "transition-all",
        "duration-700"
      );
      observer.observe(item);
    });

    // Add CSS for menu item hover effects
    const style = document.createElement("style");
    style.textContent = `
      .menu-page-item:hover .menu-img {
        transform: scale(1.05) rotate(-2deg);
        box-shadow: 0 10px 25px rgba(0,0,0,0.1);
      }
      .menu-img {
        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      }
      .category-title {
        position: relative;
        display: inline-block;
      }
      .category-title::after {
        content: '';
        position: absolute;
        bottom: -5px;
        left: 0;
        width: 50px;
        height: 3px;
        background-color: #9B111E;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const drinkCategories = [
    {
      id: "hot-coffee",
      name: "Hot Coffee",
      description: "Rich, aromatic coffee served hot",
      image:
        "https://globalassets.starbucks.com/digitalassets/products/bev/CaffeLatte.jpg",
      route: "/menu/drinks/hot-coffee",
    },
    {
      id: "cold-coffee",
      name: "Cold Coffee",
      description: "Refreshing iced coffee creations",
      image:
        "https://globalassets.starbucks.com/digitalassets/products/bev/VanillaSweetCreamColdBrew.jpg",
      route: "/menu/drinks/cold-coffee",
    },
    {
      id: "hot-tea",
      name: "Hot Tea",
      description: "Soothing herbal and classic teas",
      image:
        "https://globalassets.starbucks.com/digitalassets/products/bev/HoneyCitrusMintTea.jpg",
      route: "/menu/drinks/hot-tea",
    },
    {
      id: "cold-tea",
      name: "Cold Tea",
      description: "Refreshing iced tea varieties",
      image:
        "https://globalassets.starbucks.com/digitalassets/products/bev/IcedBlackTea.jpg",
      route: "/menu/drinks/cold-tea",
    },
    {
      id: "hot-chocolate",
      name: "Hot Chocolate",
      description: "Rich, creamy chocolate drinks",
      image:
        "https://globalassets.starbucks.com/digitalassets/products/bev/HotChocolate.jpg",
      route: "/menu/drinks/hot-chocolate",
    },
  ];

  const foodCategories = [
    {
      id: "breakfast",
      name: "Breakfast",
      description: "Morning favorites to start your day",
      image:
        "https://globalassets.starbucks.com/digitalassets/products/food/EggPestoMozzarellaSandwich.jpg",
      route: "/menu/food/breakfast",
    },
    {
      id: "bakery",
      name: "Bakery",
      description: "Freshly baked pastries and breads",
      image:
        "https://globalassets.starbucks.com/digitalassets/products/food/SBX20210915_Croissant-onGreen.jpg",
      route: "/menu/food/bakery",
    },
    {
      id: "treats",
      name: "Treats",
      description: "Sweet indulgences for any time",
      image:
        "https://globalassets.starbucks.com/digitalassets/products/food/SBX20181129_BirthdayCakePop.jpg",
      route: "/menu/food/treats",
    },
    {
      id: "lunch",
      name: "Lunch",
      description: "Satisfying midday meals",
      image:
        "https://globalassets.starbucks.com/digitalassets/products/food/SBX20220207_GrilledCheeseOnSourdough_US.jpg",
      route: "/menu/food/lunch",
    },
    {
      id: "snack",
      name: "Snacks",
      description: "Light bites and savory snacks",
      image:
        "https://globalassets.starbucks.com/digitalassets/products/food/SBX20190903_SmokedTurkeyProteinBox.jpg",
      route: "/menu/food/snack",
    },
  ];

  return (
    <main className="pt-28 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row">
        {/* Sidebar */}
        <MenuSidebar />

        {/* Main Content */}
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 font-montserrat">
            Our Menu
          </h1>
          <p className="text-gray-600 mb-8">
            Discover our premium selection of coffees and delicious food
            pairings
          </p>

          {/* Drinks Section */}
          <section id="drinks" className="mb-16">
            <h2 className="category-title text-2xl md:text-3xl font-bold text-gray-900 mb-8 font-montserrat">
              Drinks
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {drinkCategories.map((category) => (
                <Link
                  key={category.id}
                  to={category.route}
                  id={category.id}
                  className="menu-item group"
                >
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden p-4 h-full flex flex-col hover:shadow-md transition-shadow duration-300">
                    <div className="relative overflow-hidden rounded-lg mb-4">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="menu-img w-full h-40 sm:h-48 object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {category.name}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {category.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Food Section */}
          <section id="food" className="mb-16">
            <h2 className="category-title text-2xl md:text-3xl font-bold text-gray-900 mb-8 font-montserrat">
              Food
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {foodCategories.map((category) => (
                <Link
                  key={category.id}
                  to={category.route}
                  id={category.id}
                  className="menu-item group"
                >
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden p-4 h-full flex flex-col hover:shadow-md transition-shadow duration-300">
                    <div className="relative overflow-hidden rounded-lg mb-4">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="menu-img w-full h-40 sm:h-48 object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {category.name}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {category.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Mobile Snack Category (separate for better mobile display) */}
          <section className="md:hidden mt-8">
            <div className="grid grid-cols-1 gap-6">
              <Link
                to="/menu/food/snack"
                id="snack"
                className="menu-item group"
              >
                <div className="bg-white rounded-xl shadow-sm overflow-hidden p-4 h-full flex flex-col hover:shadow-md transition-shadow duration-300">
                  <div className="relative overflow-hidden rounded-lg mb-4">
                    <img
                      src="https://globalassets.starbucks.com/digitalassets/products/food/SBX20190903_SmokedTurkeyProteinBox.jpg"
                      alt="Snacks"
                      className="menu-img w-full h-48 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    Snacks
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Light bites and savory snacks
                  </p>
                </div>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default Menu;
