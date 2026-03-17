import React from 'react';
import { CategoryInfo } from '../../../types/category';
import { useAuthContext } from '../../../context/AuthContext';

interface CategoryHeaderProps {
  categoryInfo: CategoryInfo;
}

const CategoryHeader: React.FC<CategoryHeaderProps> = ({ categoryInfo }) => {
  const { isAdminPreview } = useAuthContext();

  return (
    <div className="mb-8 sm:mb-10 md:mb-12">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
        {categoryInfo.displayName}
      </h1>
      <p className="text-gray-600 mt-2 sm:mt-3 text-sm sm:text-base md:text-lg">
        {categoryInfo.description}
      </p>

      {/* Admin Preview Badge */}
      {isAdminPreview && (
        <div className="mt-4 inline-flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2">
          <span className="text-yellow-700 text-sm">
            Admin Preview Mode - View only
          </span>
        </div>
      )}
    </div>
  );
};

export default CategoryHeader;