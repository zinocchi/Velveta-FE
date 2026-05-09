import React from 'react';
import { Skeleton } from '../../../../components/ui/loading/Skeleton';

const BulkActionsBarSkeleton: React.FC = () => {
  return (
    <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 mb-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-40 rounded" />
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-36 rounded-lg" />
          <Skeleton className="h-9 w-20 rounded-lg" />
          <Skeleton className="h-9 w-20 rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export default BulkActionsBarSkeleton;