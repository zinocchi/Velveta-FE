import React from 'react';
import { Skeleton } from '../../../../components/ui/loading/Skeleton';

const OrderFiltersSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-100 mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Input Skeleton */}
        <div className="flex-1">
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>
        
        {/* Status Filter Skeleton */}
        <div className="flex gap-2">
          <Skeleton className="h-10 w-32 rounded-xl" />
        </div>
      </div>
    </div>
  );
};

export default OrderFiltersSkeleton;