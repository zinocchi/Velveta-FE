import React from 'react';
import { Skeleton } from '../../../../components/ui/loading/Skeleton';

const StatsCardsSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-8 w-20 mb-2" />
              <Skeleton className="h-3 w-28" />
            </div>
            <Skeleton className="w-12 h-12 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCardsSkeleton;