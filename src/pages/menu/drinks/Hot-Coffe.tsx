import { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import MenuCard from '../../../components/menu/MenuCard';
import menuService from '../../../services/MenuServices';
import type { Menu } from '../../../types/index';
import { ChevronLeft } from 'lucide-react';

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const location = useLocation();
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMenusByCategory();
  }, [category]);

  const fetchMenusByCategory = async () => {
    try {
      setLoading(true);
      const data = await menuService.getAllMenu();
      
      // Filter hanya menu dengan kategori yang sesuai
      const filteredMenus = data.filter(menu => 
        menu.category?.trim() === category
      );
      
      setMenus(filteredMenus);
    } catch (error) {
      console.error('Error fetching category menus:', error);
    } finally {
      setLoading(false);
    }
  };

  // Format category name untuk display
  const formatCategoryName = (cat: string | undefined): string => {
    if (!cat) return '';
    return cat.split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const categoryName = formatCategoryName(category);
  const displayName = location.state?.displayName || categoryName;

  if (loading) {
    return (
      <main className="pt-28 pb-16 max-w-7xl mx-auto px-4">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-700"></div>
          <p className="mt-4 text-gray-600">Loading {categoryName}...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-28 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Back Button */}
      <div className="mb-8">
        <Link
          to="/menu"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ChevronLeft size={20} className="mr-1" />
          Back to Menu
        </Link>
      </div>

      {/* Category Header */}
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 font-montserrat">
          {displayName}
        </h1>
        <p className="text-gray-600 mb-6">
          {menus.length} {menus.length === 1 ? 'item' : 'items'} available
        </p>
      </div>

      {/* Menu Items Grid - SAMA PERSIS dengan Menu utama */}
      {menus.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {menus.map((menu) => (
            <MenuCard key={menu.id} menu={menu} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <p className="text-gray-600">No items found in {categoryName}.</p>
          <Link
            to="/menu"
            className="mt-4 inline-block px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800"
          >
            Back to Menu
          </Link>
        </div>
      )}
    </main>
  );
};

export default CategoryPage;