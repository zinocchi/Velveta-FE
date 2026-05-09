import React from 'react';
import { Skeleton } from '../../../../components/ui/loading/Skeleton';

const RevenueChartSkeleton: React.FC = () => {
  return (
    <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-5 w-36" />
        <Skeleton className="w-20 h-8 rounded-lg" />
      </div>
      
      {/* Chart Controls Skeleton */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
          <Skeleton className="w-16 h-8 rounded-md" />
          <Skeleton className="w-16 h-8 rounded-md" />
          <Skeleton className="w-16 h-8 rounded-md" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="w-32 h-8 rounded-lg" />
          <span className="text-gray-400">-</span>
          <Skeleton className="w-32 h-8 rounded-lg" />
        </div>
        <div className="ml-auto flex gap-2">
          <Skeleton className="w-8 h-8 rounded-lg" />
          <Skeleton className="w-8 h-8 rounded-lg" />
        </div>
      </div>
      
      {/* Chart Skeleton */}
      <div className="h-80 bg-gray-50 rounded-xl flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-700 mx-auto mb-2"></div>
          <p className="text-gray-500 text-sm">Loading chart data...</p>
        </div>
      </div>
      
      {/* Summary Stats Skeleton */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i}>
            <Skeleton className="h-3 w-20 mb-1" />
            <Skeleton className="h-6 w-24" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RevenueChartSkeleton;