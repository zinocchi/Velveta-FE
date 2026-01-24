import { useLocation, useParams, Link } from "react-router-dom";
import type { Menu } from "../../types";
import { getCategoryFallbackImage } from "./constants";

type LocationState = {
  category: string;
  menu: Menu[];
  displayName: string;
};

export default function CategoryPage() {
  const { category } = useParams();
  const location = useLocation();
  const state = location.state as LocationState | null;

  // Kalau user reload halaman, state hilang → fallback
  if (!state) {
    return (
      <div className="pt-28 text-center">
        <h1 className="text-2xl font-bold">Category: {category}</h1>
        <p className="text-gray-500 mt-4">
          Data tidak ditemukan. Silakan kembali ke menu.
        </p>
        <Link
          to="/menu"
          className="mt-6 inline-block px-4 py-2 bg-red-700 text-white rounded"
        >
          Back to Menu
        </Link>
      </div>
    );
  }

  const { menu, displayName } = state;

  return (
    <main className="pt-28 pb-16 max-w-7xl mx-auto px-4">
      <h1 className="text-3xl font-bold mb-2">{displayName}</h1>
      <p className="text-gray-600 mb-8">
        Warm, aromatic coffee drinks to comfort your soul
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {menu.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl shadow p-4 hover:shadow-md transition"
          >
            <img
              src={item.image_url ?? getCategoryFallbackImage(category)}
              alt={item.name}
              className="w-full h-40 object-cover rounded mb-4"
            />
            <h3 className="text-lg font-semibold">{item.name}</h3>
            <p className="text-gray-600 text-sm mb-2">{item.description}</p>
            <p className="text-red-700 font-bold">Rp {item.price}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
