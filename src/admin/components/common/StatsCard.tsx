import React, { ReactNode } from 'react';
import { cn } from '../../../libs/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  subtitleValue?: string | number;
  icon: ReactNode;
  iconBgColor?: string;
  iconColor?: string;
  hoverColor?: string;
  className?: string;
  trend?: number; // percentage change (positive = up, negative = down)
  trendLabel?: string; // e.g. "From last month"
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  subtitleValue,
  icon,
  iconBgColor = 'bg-red-50',
  iconColor = 'text-red-700',
  hoverColor = 'hover:border-red-200',
  className,
  trend,
  trendLabel = 'From last month',
}) => {
  return (
    <div
      className={cn(
        'bg-white rounded-2xl p-6 border border-gray-100 transition-all duration-300',
        'hover:shadow-lg hover:shadow-gray-200/50',
        hoverColor,
        className
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={cn('p-2.5 rounded-xl', iconBgColor)}>
          <div className={cn('w-5 h-5', iconColor)}>{icon}</div>
        </div>
      </div>
      
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">{title}</p>
      <p className="text-2xl font-bold text-gray-900 mb-2">{value}</p>
      
      {/* Trend Badge */}
      {trend !== undefined && (
        <div className="flex items-center gap-2">
          <span className={cn(
            'inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-semibold',
            trend >= 0
              ? 'bg-emerald-50 text-emerald-600'
              : 'bg-red-50 text-red-600'
          )}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
          <span className="text-xs text-gray-400">{trendLabel}</span>
        </div>
      )}

      {/* Subtitle (legacy support) */}
      {!trend && subtitle && subtitleValue !== undefined && (
        <div className="flex items-center gap-1 text-sm">
          <span className="text-gray-500">{subtitle}:</span>
          <span className="font-semibold text-gray-900">{subtitleValue}</span>
        </div>
      )}
    </div>
  );
};

export default StatsCard;