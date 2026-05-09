import React from 'react';

interface MonthlyGoalsCardProps {
  target: number;
  achieved: number;
}

const MonthlyGoalsCard: React.FC<MonthlyGoalsCardProps> = ({ target, achieved }) => {
  const percentage = target > 0 ? Math.min(Math.round((achieved / target) * 100), 100) : 0;
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const formatCurrency = (val: number) => {
    if (val >= 1000000) return `Rp${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `Rp${(val / 1000).toFixed(0)}K`;
    return `Rp${val}`;
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 flex flex-col items-center justify-center">
      <h3 className="text-sm font-semibold text-gray-500 mb-4 self-start">Monthly Goals</h3>
      
      <div className="relative w-32 h-32 mb-4">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          {/* Background circle */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="#f3f4f6"
            strokeWidth="10"
          />
          {/* Progress circle */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="#dc2626"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        {/* Percentage text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-gray-900">{percentage}%</span>
        </div>
      </div>

      {/* Target vs Achieved */}
      <div className="flex items-center gap-6 text-center">
        <div>
          <p className="text-[11px] text-gray-400 uppercase tracking-wide font-medium">Target</p>
          <p className="text-sm font-bold text-gray-900 mt-0.5">{formatCurrency(target)}</p>
        </div>
        <div className="w-px h-8 bg-gray-200"></div>
        <div>
          <p className="text-[11px] text-gray-400 uppercase tracking-wide font-medium">Achieved</p>
          <p className="text-sm font-bold text-gray-900 mt-0.5">{formatCurrency(achieved)}</p>
        </div>
      </div>
    </div>
  );
};

export default MonthlyGoalsCard;
