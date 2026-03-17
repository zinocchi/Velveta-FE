import React from 'react';
import { Link } from 'react-router-dom';
import { CategoryInfo } from '../../../types/category';

interface CategorySectionProps {
  title: string;
  categories: CategoryInfo[];
}

const CategorySection: React.FC<CategorySectionProps> = ({ title, categories }) => {
  if (categories.length === 0) return null;

  return (
    <section className="mb-16">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
        {title}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/category/${category.id}`}
            className="menu-page-item group"
          >
            <div className="bg-white rounded-xl shadow-sm overflow-hidden p-4 h-full flex flex-col hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <div className="relative overflow-hidden rounded-lg mb-4">
                <img
                  src={category.image}
                  alt={category.displayName}
                  className="w-full h-40 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {category.displayName}
              </h3>
              <p className="text-gray-600 text-sm">{category.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategorySection;