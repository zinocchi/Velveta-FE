// src/admin/pages/orders/components/OrderTableSkeleton.tsx

import React from "react";
import { Skeleton } from "../../../../components/ui/loading/Skeleton";

const OrderTableSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="divide-y divide-gray-100">
        {/* Header Skeleton */}
        <div className="p-5 bg-gray-50/50">
          <div className="flex items-center gap-4">
            <Skeleton className="w-4 h-4 rounded" />
            <div className="flex-1 grid grid-cols-4 gap-4">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-20" />
            </div>
            <Skeleton className="w-40 h-8 rounded-lg" />
          </div>
        </div>

        {/* Rows Skeleton */}
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="p-5">
            <div className="flex items-center gap-4">
              <Skeleton className="w-4 h-4 rounded" />
              <div className="flex-1 grid grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-3 w-12" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-8 w-24 rounded-md" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
              <div className="w-40 flex justify-end gap-2">
                <Skeleton className="w-16 h-8 rounded-lg" />
                <Skeleton className="w-8 h-8 rounded-lg" />
                <Skeleton className="w-8 h-8 rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderTableSkeleton;
