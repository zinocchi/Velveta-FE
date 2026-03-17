import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Tambah useNavigate
import type { Menu } from "../../types/index";
import axios from "axios";
import { useCart } from "../../context/CartContext";
import { getCategoryFallbackImage } from "../../types/Constant";
import { flyToCart } from "../../utils/flyToCart";
import { FaMinus, FaPlus } from "react-icons/fa";
import { useAuth } from "../../auth/useAuth"; // Tambah useAuth
import CustomAlert from "../../components/ui/CustomAlert"; // Buat komponen alert

export default function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate(); // Tambah navigate
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const { state, dispatch } = useCart();
  const { isLoggedIn, isAdminPreview } = useAuth(); // Ambil auth state

  // State untuk alert
  const [alert, setAlert] = useState<{
    show: boolean;
    message: string;
    type: "error" | "warning" | "info" | "success";
  }>({
    show: false,
    message: "",
    type: "info",
  });

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
        console.log("Fetched menus for category:", res.data.data);
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

  // Helper function untuk mendapatkan quantity item di cart
  const getItemQuantity = (itemId: number) => {
    const cartItem = state.items.find((item) => item.id === itemId);
    return cartItem?.qty || 0;
  };

  // Fungsi untuk menampilkan alert
  const showAlert = (
    message: string,
    type: "error" | "warning" | "info" | "success" = "info",
  ) => {
    setAlert({ show: true, message, type });

    // Auto hide setelah 3 detik
    setTimeout(() => {
      setAlert((prev) => ({ ...prev, show: false }));
    }, 3000);
  };

  const handleAddToCart = (item: Menu, e: React.MouseEvent) => {
    e.stopPropagation();

    // Cek apakah user sudah login
    if (!isLoggedIn) {
      showAlert("You must be logged in to add items to cart", "error");

      // Optional: redirect ke login setelah 1.5 detik
      setTimeout(() => {
        navigate("/login", { state: { from: `/category/${category}` } });
      }, 1500);
      return;
    }

    if (isAdminPreview) {
      showAlert("Admin cannot add items to cart in preview mode", "warning");
      return;
    }

    // Kalau sudah login dan bukan admin, lanjutkan
    const currentQty = getItemQuantity(item.id);

    if (currentQty === 0) {
      flyToCart(
        (e.currentTarget as HTMLElement).closest(".cart-source") as HTMLElement,
      );
    }

    dispatch({
      type: "ADD_TO_CART",
      payload: {
        id: item.id,
        name: item.name,
        price: item.price,
        image_url: item.image_url,
      },
    });

    showAlert(`${item.name} added to cart!`, "success");
  };

  const handleIncrease = (item: Menu, e: React.MouseEvent) => {
    e.stopPropagation();

    // Cek apakah user sudah login
    if (!isLoggedIn) {
      showAlert("You must be logged in to add items to cart", "error");
      setTimeout(() => {
        navigate("/login", { state: { from: `/category/${category}` } });
      }, 1500);
      return;
    }

    // Cek apakah admin preview mode
    if (isAdminPreview) {
      showAlert("Admin cannot add items to cart in preview mode", "warning");
      return;
    }

    const currentQty = getItemQuantity(item.id);

    if (currentQty === 0) {
      flyToCart(
        (e.currentTarget as HTMLElement).closest(".cart-source") as HTMLElement,
      );
    }

    dispatch({
      type: "ADD_TO_CART",
      payload: {
        id: item.id,
        name: item.name,
        price: item.price,
        image_url: item.image_url,
      },
    });
  };

  const handleDecrease = (itemId: number, e: React.MouseEvent) => {
    e.stopPropagation();

    // Cek apakah user sudah login
    if (!isLoggedIn) {
      showAlert("You must be logged in to modify cart", "error");
      setTimeout(() => {
        navigate("/login", { state: { from: `/category/${category}` } });
      }, 1500);
      return;
    }

    // Cek apakah admin preview mode
    if (isAdminPreview) {
      showAlert("Admin cannot modify cart in preview mode", "warning");
      return;
    }

    dispatch({ type: "DECREMENT", payload: itemId });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-700"></div>
          <p className="mt-4 text-gray-600">Loading menu...</p>
        </div>
      </div>
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
    <main className="pt-20 md:pt-28 pb-16 md:pb-20 relative">
      {/* Custom Alert Component */}
      <CustomAlert
        show={alert.show}
        message={alert.message}
        type={alert.type}
        onClose={() => setAlert((prev) => ({ ...prev, show: false }))}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Category Header */}
        <div className="mb-8 sm:mb-10 md:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
            {info.title}
          </h1>
          <p className="text-gray-600 mt-2 sm:mt-3 text-sm sm:text-base md:text-lg">
            {info.description}
          </p>

          {/* Admin Preview Badge */}
          {isAdminPreview && (
            <div className="mt-4 inline-flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2">
              <span className="text-yellow-700 text-sm">
                Admin Preview Mode - View only
              </span>
            </div>
          )}
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
          {menus.map((item) => {
            const quantity = getItemQuantity(item.id);

            return (
              <div
                key={item.id}
                className={`cart-source bg-white rounded-lg sm:rounded-xl shadow-sm overflow-hidden p-3 sm:p-4 md:p-5 h-full flex flex-col hover:shadow-md transition-shadow duration-300 ${
                  isAdminPreview ? "opacity-90" : ""
                }`}>
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

                {/* Price */}
                <div className="mt-auto">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-base sm:text-lg font-bold text-gray-900">
                      Rp {item.price.toLocaleString("id-ID")}
                    </p>

                    {/* Tombol Add - Conditional berdasarkan auth state */}
                    {!isLoggedIn ? (
                      <button
                        className="bg-gray-400 hover:bg-gray-500 text-white text-xs sm:text-sm font-medium py-1.5 sm:py-2 px-3 sm:px-4 rounded-md sm:rounded-lg transition-colors duration-300 cursor-pointer"
                        onClick={(e) => handleAddToCart(item, e)}>
                        Add
                      </button>
                    ) : isAdminPreview ? (
                      <button></button>
                    ) : quantity === 0 ? (
                      <button
                        className="bg-red-700 hover:bg-red-800 text-white text-xs sm:text-sm font-medium py-1.5 sm:py-2 px-3 sm:px-4 rounded-md sm:rounded-lg transition-colors duration-300 active:scale-95"
                        onClick={(e) => handleIncrease(item, e)}>
                        Add
                      </button>
                    ) : null}
                  </div>

                  {/* Quantity Control - Muncul di bawah price jika quantity > 0 dan bukan admin */}
                  {quantity > 0 && !isAdminPreview && isLoggedIn && (
                    <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                      <span className="text-xs sm:text-sm text-gray-600">
                        Quantity:
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => handleDecrease(item.id, e)}
                          className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-700 rounded-full transition-colors">
                          <FaMinus className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        </button>
                        <span className="w-8 text-center text-sm sm:text-base font-semibold text-red-700">
                          {quantity}
                        </span>
                        <button
                          onClick={(e) => handleIncrease(item, e)}
                          disabled={quantity >= 10}
                          className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-700 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-red-50">
                          <FaPlus className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Quantity untuk admin preview (display only) */}
                  {quantity > 0 && isAdminPreview && (
                    <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                      <span className="text-xs sm:text-sm text-gray-600">
                        In cart:
                      </span>
                      <span className="text-sm font-semibold text-gray-500">
                        {quantity} items
                      </span>
                    </div>
                  )}

                  {/* Pesan jika sudah mencapai maksimum */}
                  {quantity >= 10 && !isAdminPreview && (
                    <p className="text-xs text-red-600 mt-2 text-right">
                      Max quantity reached
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
