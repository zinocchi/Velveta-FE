import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useMenu } from '../../hooks/useMenu';
import { DRINK_CATEGORIES, FOOD_CATEGORIES } from '../../types/category';

import { LoadingPage } from '../../components/ui/loading';
import { Alert } from '../../components/ui/Alert';
import CategorySection from './components/CategorySection';

const MenuPage = () => {
  const location = useLocation();
  const { groupedCategories, loading, error, refetch } = useMenu();
  const isFromDashboard = location.pathname.includes('/dashboard');

  useEffect(() => {
    const menuItems = document.querySelectorAll('.menu-page-item');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
          }
        });
      },
      { threshold: 0.1 }
    );

    menuItems.forEach((item) => {
      item.classList.add(
        'opacity-0',
        'translate-y-6',
        'transition-all',
        'duration-700'
      );
      observer.observe(item);
    });

    return () => observer.disconnect();
  }, [groupedCategories]);

  const getMainPaddingTop = () => {
    return isFromDashboard ? 'pt-4' : 'pt-24';
  };

  if (loading) {
    return (
      <main
        className={`${getMainPaddingTop()} pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`}
      >
        <LoadingPage message="Loading menu..." fullScreen={false} />
      </main>
    );
  }

  if (error) {
    return (
      <main className="pt-28 pb-16 max-w-7xl mx-auto px-4">
        <Alert
          type="error"
          message={error}
          className="mb-4"
        />
        <button
          onClick={refetch}
          className="px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800"
        >
          Retry
        </button>
      </main>
    );
  }

  return (
    <main
      className={`${getMainPaddingTop()} pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`}
    >
      <div className="flex flex-col lg:flex-row gap-8">

        {/* Main Content */}
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Our Menu
          </h1>
          <p className="text-gray-600 mb-8">
            Discover our premium selection of coffees and delicious food pairings
          </p>

          {/* Drinks Section */}
          {DRINK_CATEGORIES.some(cat => groupedCategories[cat.id]) && (
            <CategorySection
              title="Drinks"
              categories={DRINK_CATEGORIES.filter(cat => groupedCategories[cat.id])}
            />
          )}

          {/* Food Section */}
          {FOOD_CATEGORIES.some(cat => groupedCategories[cat.id]) && (
            <CategorySection
              title="Food"
              categories={FOOD_CATEGORIES.filter(cat => groupedCategories[cat.id])}
            />
          )}

          {/* Empty State */}
          {Object.keys(groupedCategories).length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <p className="text-gray-600">No menu categories available.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default MenuPage;