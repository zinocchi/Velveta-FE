import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCategoryMenu } from "../../hooks/useMenu";
import { useCart } from "../../context/CartContext";
import { useAuthContext } from "../../context/AuthContext";
import { getCategoryInfo } from "../../types/category";

import { LoadingPage } from "../../components/ui/loading";
import { Alert } from "../../components/ui/Alert";
import CategoryHeader from "./components/CategoryHeader";
import MenuGrid from "./components/MenuGrid";

import { flyToCart } from "../../utils/flyToCart";
import { Menu } from "../../types";

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const { items, loading, error, regroup } = useCategoryMenu(category || "");
  const isFromDashboard = location.pathname.includes("/dashboard");

  const { state, dispatch } = useCart();
  const { isLoggedIn, isAdminPreview } = useAuthContext();

  const categoryInfo = getCategoryInfo(category || "");

  useEffect(() => {
    if (!category) {
      navigate("/menu");
    } else {
      regroup();
    }
  }, [category, navigate]);

  const getItemQuantity = (itemId: number) => {
    const cartItem = state.items.find((item) => item.id === itemId);
    return cartItem?.qty || 0;
  };

  const handleAddToCart = (item: Menu, e: React.MouseEvent) => {
    e.stopPropagation();

    if (!isLoggedIn) {
      console.log("Not logged in, returning early");
      return;
    }

    if (isAdminPreview) {
      console.log("Admin preview mode, returning early");
      return;
    }

    const currentQty = getItemQuantity(item.id);

    const sourceElement = (e.currentTarget as HTMLElement).closest(
      ".cart-source",
    ) as HTMLElement;
    if (sourceElement) {
      flyToCart(sourceElement);
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

  const handleIncrease = (item: Menu, e: React.MouseEvent) => {
    e.stopPropagation();

    if (!isLoggedIn || isAdminPreview) return;

    const currentQty = getItemQuantity(item.id);

    const sourceElement = (e.currentTarget as HTMLElement).closest(
      ".cart-source",
    ) as HTMLElement;
    if (sourceElement) {
      flyToCart(sourceElement);
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

    if (!isLoggedIn || isAdminPreview) return;

    dispatch({ type: "DECREMENT", payload: itemId });
  };

  const getMainPaddingTop = () => {
    return isFromDashboard ? "pt-4" : "pt-24";
  };

  if (loading) {
    return (
      <main
        className={`${getMainPaddingTop()} pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`}>
        <LoadingPage message="Loading menu..." fullScreen={false} />
      </main>
    );
  }

  if (error) {
    return (
      <main className="pt-20 md:pt-28 pb-16 max-w-7xl mx-auto px-4">
        <Alert type="error" message={error} className="mb-4" />
      </main>
    );
  }

  return (
    <main className="pt-20 md:pt-28 pb-16 md:pb-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <CategoryHeader categoryInfo={categoryInfo} />

            <MenuGrid
              items={items}
              category={category}
              quantities={Object.fromEntries(
                items.map((item) => [item.id, getItemQuantity(item.id)]),
              )}
              onAddToCart={handleAddToCart}
              onIncrease={handleIncrease}
              onDecrease={handleDecrease}
              isLoggedIn={isLoggedIn}
              isAdminPreview={isAdminPreview}
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default CategoryPage;
