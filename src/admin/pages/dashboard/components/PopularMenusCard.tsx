import React from 'react';
import { FaStar, FaCoffee } from 'react-icons/fa';
import { DashboardStats } from '../../../types/dashboard';

interface PopularMenusCardProps {
  stats: DashboardStats | null;
}

const PopularMenusCard: React.FC<PopularMenusCardProps> = ({ stats }) => {
  const menus = stats?.popularMenus || [];

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Popular Menus</h3>
      <div className="space-y-3 max-h-[240px] overflow-y-auto">
        {menus.length > 0 ? (
          menus.map((menu) => (
            <div key={menu.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  {menu.image ? (
                    <img src={menu.image} alt={menu.name} className="w-6 h-6 object-cover rounded" />
                  ) : (
                    <FaCoffee className="w-4 h-4 text-gray-400" />
                  )}
                </div>
                <span className="text-sm text-gray-600 truncate max-w-[120px]">
                  {menu.name}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <FaStar className="w-3 h-3 text-amber-400" />
                <span className="text-sm font-semibold text-gray-900">
                  {menu.total_sold}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500 text-center py-4">No data available</p>
        )}
      </div>
    </div>
  );
};

export default PopularMenusCard;