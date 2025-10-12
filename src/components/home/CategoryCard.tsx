import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Category } from '../../types/api';
import { formatCategoryForDisplay } from '../../utils/productUtils';

interface CategoryCardProps {
  category: Category;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  const navigate = useNavigate();
  
  const displayData = useMemo(() => formatCategoryForDisplay(category), [category]);

  const handleClick = () => {
    navigate(`/products?category=${displayData.category_uid}`);
  };

  return (
    <div
      onClick={handleClick}
      className="group relative overflow-hidden rounded-xl cursor-pointer transition-all duration-300 hover:shadow-2xl bg-white dark:bg-gray-800"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
      aria-label={`Browse ${displayData.category_name}`}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={displayData.category_image}
          alt={displayData.category_name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        
        {/* Product Count Badge */}
        {displayData.product_count > 0 && (
          <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full text-sm font-semibold text-gray-900 dark:text-white">
            {displayData.product_count} {displayData.product_count === 1 ? 'Product' : 'Products'}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <h3 className="text-2xl font-bold text-white mb-2 transform transition-transform duration-300 group-hover:translate-y-[-4px]">
          {displayData.category_name}
        </h3>
        <div className="flex items-center text-white opacity-0 transform translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
          <span className="text-sm font-medium mr-2">Shop Now</span>
          <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </div>

      {/* Hover Border Effect */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-500 dark:group-hover:border-blue-400 rounded-xl transition-colors duration-300 pointer-events-none" />
    </div>
  );
};

export default CategoryCard;

