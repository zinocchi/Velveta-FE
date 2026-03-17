import React from "react";
import StatsCard from "../ui/StatsCard";
import { FaShoppingBag, FaStar, FaHeart } from "react-icons/fa";
import { formatCurrency } from "../../utils/formatters";

interface StatsOverviewProps {
  totalOrders: number;
  totalSpent: number;
  favoriteDrink: string;
  favoriteCount: number;
  points?: number;
}

const StatsOverview: React.FC<StatsOverviewProps> = ({
  totalOrders,
  totalSpent,
  favoriteDrink,
  favoriteCount,
  points = 0,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Total Orders Card */}
      <StatsCard
        title="Total Orders"
        value={totalOrders}
        subtitle="Total spent"
        subtitleValue={formatCurrency(totalSpent)}
        icon={<FaShoppingBag />}
        iconBgColor="bg-red-50"
        iconColor="text-red-700"
        hoverColor="hover:border-red-200"
      />

      {/* Points Earned Card */}
      <StatsCard
        title="Points Earned"
        value={points}
        subtitle="Coming soon"
        subtitleValue=""
        icon={<FaStar />}
        iconBgColor="bg-amber-50"
        iconColor="text-amber-600"
        hoverColor="hover:border-amber-200"
        className="opacity-75"
      />

      {/* Favorite Drink Card */}
      <StatsCard
        title="Favorite Drink"
        value={favoriteDrink}
        subtitle="Ordered"
        subtitleValue={`${favoriteCount} times`}
        icon={<FaHeart />}
        iconBgColor="bg-blue-50"
        iconColor="text-blue-600"
        hoverColor="hover:border-blue-200"
        className="truncate"
      />
    </div>
  );
};

export default StatsOverview;