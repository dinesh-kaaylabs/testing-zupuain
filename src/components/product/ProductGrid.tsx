import React from 'react';
import { Product } from '../../types/api';
import { formatProductForDisplay, ProductDisplayData } from '../../utils/productUtils';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
  productsDisplayData: Map<string, ProductDisplayData>;
  viewMode: 'grid' | 'list';
  isInWishlist: (uid: string) => boolean;
  onAddToCart: (product: Product, displayData: ProductDisplayData) => void;
  onToggleWishlist: (product: Product) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  productsDisplayData,
  viewMode,
  isInWishlist,
  onAddToCart,
  onToggleWishlist,
}) => {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <svg
          className="w-24 h-24 text-gray-300 dark:text-gray-600 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          No products found
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
          Try adjusting your filters or search query to find what you're looking for.
        </p>
      </div>
    );
  }

  return (
    <div
      className={
        viewMode === 'grid'
          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
          : 'flex flex-col gap-6'
      }
    >
      {products.map((product) => {
        const displayData = formatProductForDisplay(product);
        if (!displayData) return null;

        return (
          <ProductCard
            key={product.product_uid}
            product={product}
            displayData={displayData}
            viewMode={viewMode}
            isInWishlist={isInWishlist(product.product_uid)}
            onAddToCart={() => onAddToCart(product, displayData)}
            onToggleWishlist={() => onToggleWishlist(product)}
          />
        );
      })}
    </div>
  );
};

// Skeleton loader component
export const ProductGridSkeleton: React.FC<{ viewMode: 'grid' | 'list'; count?: number }> = ({ 
  viewMode, 
  count = 12 
}) => {
  if (viewMode === 'list') {
    return (
      <div className="flex flex-col gap-6">
        {[...Array(count)].map((_, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden flex flex-col sm:flex-row animate-pulse"
          >
            <div className="w-full sm:w-48 h-48 sm:h-auto bg-gray-200 dark:bg-gray-700 flex-shrink-0" />
            <div className="flex-1 p-6">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-3" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 mb-4" />
              <div className="flex items-center justify-between">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-24" />
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-32" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(count)].map((_, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden animate-pulse"
        >
          <div className="aspect-square bg-gray-200 dark:bg-gray-700" />
          <div className="p-4">
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-3" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-4" />
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-full mb-3" />
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;

