import React from 'react';
import { DashboardStats } from '../../../types/dashboard';
import { formatCurrency } from '../../../../utils/formatters';

interface BudgetUsageCardProps {
  stats: DashboardStats | null;
}

interface BudgetItem {
  label: string;
  spent: number;
  budget: number;
}

const BudgetUsageCard: React.FC<BudgetUsageCardProps> = ({ stats }) => {
  // Derive budget data from actual stats (adapted for coffee shop context)
  const totalRevenue = stats?.totalRevenue || 0;
  const todayRevenue = stats?.todayRevenue || 0;

  const budgetItems: BudgetItem[] = [
    {
      label: 'Monthly Revenue',
      spent: totalRevenue,
      budget: totalRevenue > 0 ? Math.ceil(totalRevenue * 1.3 / 1000) * 1000 : 5000000,
    },
    {
      label: 'Daily Target',
      spent: todayRevenue,
      budget: todayRevenue > 0 ? Math.ceil(todayRevenue * 1.5 / 1000) * 1000 : 500000,
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-semibold text-gray-900">Budget / Usage</h3>
        <button className="text-gray-300 hover:text-gray-500 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
      </div>

      <div className="space-y-5">
        {budgetItems.map((item) => {
          const percentage = item.budget > 0 ? Math.min(Math.round((item.spent / item.budget) * 100), 100) : 0;
          
          return (
            <div key={item.label}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">{item.label}</span>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-gray-400">{formatCurrency(item.budget)}</span>
                  <span className="text-gray-300">·</span>
                  <span className="text-gray-500 font-medium">{percentage}%</span>
                </div>
              </div>
              <div className="relative">
                <div className="w-full h-8 bg-gray-50 rounded-lg overflow-hidden">
                  <div
                    className="h-full bg-red-500 rounded-lg flex items-center justify-end pr-3 transition-all duration-700 ease-out"
                    style={{ width: `${Math.max(percentage, 8)}%` }}
                  >
                    <span className="text-xs font-bold text-white whitespace-nowrap">
                      {formatCurrency(item.spent)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Insight Text */}
      <div className="mt-5 p-3 bg-gray-50 rounded-xl">
        <p className="text-xs text-gray-500 leading-relaxed">
          {budgetItems[0] && budgetItems[0].spent > 0
            ? `Revenue is at ${Math.round((budgetItems[0].spent / budgetItems[0].budget) * 100)}% of target. Keep pushing to reach your monthly goal!`
            : 'No revenue data available yet for this period.'}
        </p>
      </div>
    </div>
  );
};

export default BudgetUsageCard;
