import React from 'react';
import { Skeleton } from '../../../../components/ui/loading/Skeleton';

const DashboardSkeleton: React.FC = () => {
  return (
    <div className="p-8">
      {/* Welcome Section Skeleton */}
      <div className="mb-8">
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-48" />
      </div>

      {/* Stats Cards Skeleton */}
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

      {/* Order Status & Stock Overview Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Order Status Card Skeleton */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <Skeleton className="h-5 w-32 mb-4" />
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Skeleton className="w-2 h-2 rounded-full" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-4 w-8" />
              </div>
            ))}
          </div>
        </div>

        {/* Stock Status Card Skeleton */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <Skeleton className="h-5 w-32 mb-4" />
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Skeleton className="w-4 h-4 rounded" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-4 w-8" />
              </div>
            ))}
          </div>
        </div>

        {/* Popular Menus Card Skeleton */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <Skeleton className="h-5 w-32 mb-4" />
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Skeleton className="w-8 h-8 rounded-lg" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="flex items-center gap-1">
                  <Skeleton className="w-3 h-3 rounded-full" />
                  <Skeleton className="h-4 w-8" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Revenue Chart & Recent Orders Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart Card Skeleton */}
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

        {/* Recent Orders Card Skeleton */}
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
      </div>
    </div>
  );
};

export default DashboardSkeleton;