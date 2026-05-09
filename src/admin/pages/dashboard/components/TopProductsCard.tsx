import React from 'react';
import { DashboardStats } from '../../../types/dashboard';

interface TopProductsCardProps {
  stats: DashboardStats | null;
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// Generate a seeded pseudo-random value based on category + day
const getHeatValue = (catIndex: number, dayIndex: number): number => {
  const seed = (catIndex * 7 + dayIndex * 13 + 42) % 100;
  return seed;
};

const getHeatColor = (value: number): string => {
  if (value > 75) return 'bg-red-500';
  if (value > 50) return 'bg-red-400';
  if (value > 30) return 'bg-red-300';
  if (value > 15) return 'bg-red-100';
  return 'bg-gray-100';
};

const TopProductsCard: React.FC<TopProductsCardProps> = ({ stats }) => {
  const menus = stats?.popularMenus || [];
  
  // Use actual popular menu names, or fallback defaults
  const categories = menus.length > 0
    ? menus.slice(0, 5).map(m => m.name.length > 12 ? m.name.substring(0, 12) + '…' : m.name)
    : ['Espresso', 'Latte', 'Cappuccino', 'Pastry', 'Cold Brew'];

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-semibold text-gray-900">Top Products</h3>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span className="w-3 h-3 rounded bg-gray-100 inline-block"></span>
          <span>Low</span>
          <span className="w-3 h-3 rounded bg-red-500 inline-block"></span>
          <span>High</span>
        </div>
      </div>

      <div className="space-y-2.5">
        {categories.map((category, catIdx) => (
          <div key={category} className="flex items-center gap-3">
            <span className="text-xs text-gray-500 w-20 truncate flex-shrink-0 text-right">
              {category}
            </span>
            <div className="flex gap-1.5 flex-1">
              {DAYS.map((day, dayIdx) => (
                <div
                  key={day}
                  className={`w-7 h-7 rounded-md ${getHeatColor(getHeatValue(catIdx, dayIdx))} transition-colors`}
                  title={`${category} - ${day}`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Day labels */}
      <div className="flex items-center gap-3 mt-3">
        <span className="w-20 flex-shrink-0"></span>
        <div className="flex gap-1.5 flex-1">
          {DAYS.map(day => (
            <span key={day} className="w-7 text-center text-[10px] text-gray-400 font-medium">
              {day}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopProductsCard;
