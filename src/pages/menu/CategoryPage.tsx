import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Menu } from "../../types";
import axios from "axios";
import { useCart } from "../../context/CartContext";
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

  const { dispatch } = useCart();

  const { state } = useCart();
  console.log("Cart State:", state);

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

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {menus.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl shadow-sm overflow-hidden p-4 h-full flex flex-col hover:shadow-md transition-shadow duration-300"
          >
            {/* Image */}
            <div className="relative overflow-hidden rounded-lg mb-4">
              <img
                src={item.image_url ?? getCategoryFallbackImage(category)}
                alt={item.name}
                className="menu-img w-full h-40 object-cover rounded-lg"
              />
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {item.name}
            </h3>

            {/* Description */}
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {item.description}
            </p>

            {/* Spacer biar tombol selalu di bawah */}
            <div className="mt-auto flex items-center justify-between">
              <p className="text-base font-bold text-gray-900">
                Rp {item.price.toLocaleString("id-ID")}
              </p>
              <button
              className="bg-red-700 hover:bg-red-700 text-white text-sm font-medium py-1.5 px-4 rounded-md transition-colors duration-300"
                onClick={() =>
                  dispatch({
                    type: "ADD_TO_CART",
                    payload: {
                      id: item.id,
                      name: item.name,
                      price: item.price,
                      image_url: item.image_url,
                    },
                  })
                }
              >
                Add
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
