import React from 'react';
import { Skeleton } from '../../../../components/ui/loading/Skeleton';

const RecentOrdersSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-16" />
      </div>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="p-3 rounded-xl">
            <div className="flex items-center justify-between mb-1">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Skeleton className="h-4 w-28 mb-1" />
                <Skeleton className="h-3 w-32" />
              </div>
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentOrdersSkeleton;