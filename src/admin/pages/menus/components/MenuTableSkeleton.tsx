import React from 'react';
import { Skeleton } from '../../../../components/ui/loading';

const MenuTableSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-4 py-3">
                <Skeleton className="h-3 w-12" />
              </th>
              <th className="text-left px-4 py-3">
                <Skeleton className="h-3 w-16" />
              </th>
              <th className="text-left px-4 py-3">
                <Skeleton className="h-3 w-20" />
              </th>
              <th className="text-left px-4 py-3">
                <Skeleton className="h-3 w-16" />
              </th>
              <th className="text-left px-4 py-3">
                <Skeleton className="h-3 w-16" />
              </th>
              <th className="text-left px-4 py-3">
                <Skeleton className="h-3 w-16" />
              </th>
              <th className="text-left px-4 py-3">
                <Skeleton className="h-3 w-16" />
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, index) => (
              <tr key={index} className="border-b border-gray-100">
                <td className="px-4 py-3">
                  <Skeleton className="w-12 h-12 rounded-lg" />
                </td>
                <td className="px-4 py-3">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Skeleton className="h-6 w-20 rounded-full" />
                </td>
                <td className="px-4 py-3">
                  <Skeleton className="h-4 w-16" />
                </td>
                <td className="px-4 py-3">
                  <Skeleton className="h-6 w-24 rounded-full" />
                </td>
                <td className="px-4 py-3">
                  <Skeleton className="h-6 w-20 rounded-full" />
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Skeleton className="w-8 h-8 rounded-lg" />
                    <Skeleton className="w-8 h-8 rounded-lg" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MenuTableSkeleton;