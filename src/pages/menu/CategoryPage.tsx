import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCategoryMenu } from '../../hooks/useMenu';
import { useCart } from '../../context/CartContext';
import { useAuthContext } from '../../context/AuthContext';
import { getCategoryInfo } from '../../types/category';

// Components
import { LoadingPage } from '../../components/ui/loading';
import { Alert } from '../../components/ui/Alert';
import CategoryHeader from './components/CategoryHeader';
import MenuGrid from './components/MenuGrid';
import MenuSidebar from './components/MenuSidebar';


import { flyToCart } from '../../utils/flyToCart';

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const { items, loading, error } = useCategoryMenu(category || '');
  const { state, dispatch } = useCart();
  const { isLoggedIn, isAdminPreview } = useAuthContext();

  const categoryInfo = getCategoryInfo(category || '');

  useEffect(() => {
    if (!category) {
      navigate('/menu');
    }
  }, [category, navigate]);

  const getItemQuantity = (itemId: number) => {
    const cartItem = state.items.find((item) => item.id === itemId);
    return cartItem?.qty || 0;
  };

  const handleAddToCart = (item: Menu, e: React.MouseEvent) => {
    e.stopPropagation();

    if (!isLoggedIn) {
      return;
    }

    if (isAdminPreview) {
      return;
    }

    const currentQty = getItemQuantity(item.id);

    if (currentQty === 0) {
      flyToCart(
        (e.currentTarget as HTMLElement).closest('.cart-source') as HTMLElement
      );
    }

    dispatch({
      type: 'ADD_TO_CART',
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

    if (currentQty === 0) {
      flyToCart(
        (e.currentTarget as HTMLElement).closest('.cart-source') as HTMLElement
      );
    }

    dispatch({
      type: 'ADD_TO_CART',
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

    dispatch({ type: 'DECREMENT', payload: itemId });
  };

  if (loading) {
    return <LoadingPage message="Loading menu..." fullScreen />;
  }

  if (error) {
    return (
      <main className="pt-20 md:pt-28 pb-16 max-w-7xl mx-auto px-4">
        <Alert
          type="error"
          message={error}
          className="mb-4"
        />
      </main>
    );
  }

  return (
    <main className="pt-20 md:pt-28 pb-16 md:pb-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <MenuSidebar />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <CategoryHeader categoryInfo={categoryInfo} />

            <MenuGrid
              items={items}
              category={category}
              quantities={Object.fromEntries(
                items.map(item => [item.id, getItemQuantity(item.id)])
              )}
              onAddToCart={handleAddToCart}
              onIncrease={handleIncrease}
              onDecrease={handleDecrease}
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default CategoryPage;