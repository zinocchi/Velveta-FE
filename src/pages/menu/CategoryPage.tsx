import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Menu } from "../../types";
import axios from "axios";
import { getCategoryFallbackImage } from "./constants";

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
        // lihat dulu di console bentuk datanya kalau mau yakin
        // console.log(res.data);

        setMenus(res.data.data); // <- INI PENTING
      })
      .catch((err) => {
        console.error(err);
        setMenus([]); // biar ga crash
      })
      .finally(() => {
        setLoading(false);
      });
  }, [category]);

  const info = CATEGORY_INFO[category ?? ""] ?? {
    title: category?.replaceAll("_", " "),
    description: "Delicious menu items available in this category.",
  };

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

  if (menus.length === 0) {
    return (
      <main className="pt-28 max-w-7xl mx-auto px-4 text-center">
        <h1 className="text-3xl font-bold mb-4">{info.title}</h1>
        <p className="text-gray-600 mb-8">{info.description}</p>

        <div className="mt-10 text-gray-500 text-lg">
          This category is unavailable
        </div>
      </main>
    );
  }

  return (
    <main className="pt-28 pb-16 max-w-7xl mx-auto px-4">
      <div className="mb-10">
        <h1 className="text-3xl font-bold">{info.title}</h1>
        <p className="text-gray-600 mt-2">{info.description}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {menus.map((item) => (
          <div
            key={item.id}
            className="menu-item bg-white rounded-xl shadow-sm overflow-hidden"
          >
            {/* Image Container */}
            <div className="relative overflow-hidden">
              <img
                src={item.image_url ?? getCategoryFallbackImage(category)}
                alt={item.name}
                className="menu-img w-full h-40 sm:h-48 object-cover rounded-lg"
              />
            </div>

            {/* Content Container */}
            <div className="p-5">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {item.name}
                </h3>
                <p className="text-gray-600 text-sm">
                  {item.description}
                </p>
              </div>

              {/* Price and Button Section */}
              <div className="flex items-center justify-between">
                <p className="text-lg font-bold text-gray-900">
                  Rp {item.price.toLocaleString("id-ID")}
                </p>
                <button className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-300">
                  + Add
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}