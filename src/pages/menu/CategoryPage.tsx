import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Menu } from "../../types";
import axios from "axios";
import { useCart } from "../../context/CartContext";
import { getCategoryFallbackImage } from "./constants";
import { flyToCart } from "../../utils/flyToCart";

export default function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);

  const CATEGORY_INFO: Record<string, { title: string; description: string }> =
    {
      hot_coffee: {
        title: "Hot Coffee",
        description: "Rich, aromatic coffee served hot to warm your day.",
      },
      cold_coffee: {
        title: "Cold Coffee",
        description: "Refreshing iced coffee creations for any time.",
      },
      hot_tea: {
        title: "Hot Tea",
        description: "Soothing herbal and classic tea selections.",
      },
      cold_tea: {
        title: "Cold Tea",
        description: "Fresh iced tea varieties to cool you down.",
      },
      bakery: {
        title: "Bakery",
        description: "Freshly baked pastries and breads.",
      },
      treats: {
        title: "Treats",
        description: "Sweet treats for every mood.",
      },
      lunch: {
        title: "Lunch",
        description: "Hearty meals for your midday break.",
      },
    };

  useEffect(() => {
    setLoading(true);

    axios
      .get("http://localhost:8000/api/menu", {
        params: { category },
      })
      .then((res) => {
        setMenus(res.data.data);
      })
      .catch((err) => {
        console.error(err);
        setMenus([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [category]);

  const info = CATEGORY_INFO[category ?? ""] ?? {
    title: category?.replaceAll("_", " "),
    description: "Delicious menu items available in this category.",
  };

  const { dispatch } = useCart();

  if (loading) {
    return (
      <main className="min-h-screen pt-16 md:pt-20 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-700"></div>
          <p className="mt-4 text-gray-600">Loading menu...</p>
        </div>
      </main>
    );
  }

  if (menus.length === 0) {
    return (
      <main className="pt-20 md:pt-28 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center py-12 md:py-16">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            {info.title}
          </h1>
          <p className="text-gray-600 mb-8 text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
            {info.description}
          </p>
          <div className="mt-10 text-gray-500 text-lg">
            This category is unavailable
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-20 md:pt-28 pb-16 md:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Category Header */}
        <div className="mb-8 sm:mb-10 md:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
            {info.title}
          </h1>
          <p className="text-gray-600 mt-2 sm:mt-3 text-sm sm:text-base md:text-lg">
            {info.description}
          </p>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
          {menus.map((item) => (
            <div
              key={item.id}
              className="cart-source bg-white rounded-lg sm:rounded-xl shadow-sm overflow-hidden p-3 sm:p-4 md:p-5 h-full flex flex-col hover:shadow-md transition-shadow duration-300"
            >
              {/* Image */}
              <div className="overflow-hidden rounded-md sm:rounded-lg mb-3 sm:mb-4">
                <img
                  src={item.image_url ?? getCategoryFallbackImage(category)}
                  alt={item.name}
                  className="w-full h-32 sm:h-36 md:h-40 object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = getCategoryFallbackImage(category);
                  }}
                />
              </div>

              {/* Title */}
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">
                {item.name}
              </h3>

              {/* Description */}
              <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
                {item.description}
              </p>

              {/* Price and Button */}
              <div className="mt-auto flex items-center justify-between">
                <p className="text-base sm:text-lg font-bold text-gray-900">
                  Rp {item.price.toLocaleString("id-ID")}
                </p>
                <button
                  className="bg-red-700 hover:bg-red-800 text-white text-xs sm:text-sm font-medium py-1.5 sm:py-2 px-3 sm:px-4 rounded-md sm:rounded-lg transition-colors duration-300 active:scale-95"
                  onClick={(e) => {
                    flyToCart(
                      e.currentTarget.closest(".cart-source") as HTMLElement,
                    );
                    dispatch({
                      type: "ADD_TO_CART",
                      payload: {
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        image_url: item.image_url,
                      },
                    });
                  }}
                >
                  <span className="hidden sm:inline">Add</span>
                  <span className="sm:hidden">Add</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
