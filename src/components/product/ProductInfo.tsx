import React, { useState } from 'react';
import { ProductDisplayData } from '../../utils/productUtils';

interface ProductInfoProps {
  displayData: ProductDisplayData;
  productCode?: string | null;
  averageRating: number;
  totalReviews: number;
}

const ProductInfo: React.FC<ProductInfoProps> = ({
  displayData,
  productCode,
  averageRating,
  totalReviews,
}) => {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  return (
    <div className="space-y-4">
      {/* Product Name */}
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
        {displayData.displayName}
      </h1>

      {/* Brand Badge */}
      {displayData.brand && (
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 border border-blue-200 dark:border-blue-800 rounded-lg">
          <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
          <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
            Brand: {displayData.brand}
          </span>
        </div>
      )}

      {/* Rating and SKU */}
      <div className="flex items-center gap-6 flex-wrap">
        {/* Rating */}
        {totalReviews > 0 && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.floor(averageRating)
                      ? 'text-yellow-400 fill-current'
                      : i < averageRating
                      ? 'text-yellow-400'
                      : 'text-gray-300 dark:text-gray-600 fill-current'
                  }`}
                  viewBox="0 0 20 20"
                >
                  {i < averageRating && i >= Math.floor(averageRating) ? (
                    <defs>
                      <linearGradient id="half-star-info">
                        <stop offset="50%" stopColor="currentColor" />
                        <stop offset="50%" stopColor="transparent" />
                      </linearGradient>
                    </defs>
                  ) : null}
                  <path
                    fill={i < averageRating && i >= Math.floor(averageRating) ? 'url(#half-star-info)' : 'currentColor'}
                    d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"
                  />
                </svg>
              ))}
            </div>
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              {averageRating.toFixed(1)}
            </span>
            <a
              href="#reviews"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              ({totalReviews} {totalReviews === 1 ? 'review' : 'reviews'})
            </a>
          </div>
        )}

        {/* SKU */}
        {productCode && (
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium">SKU:</span>
            <span className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
              {productCode}
            </span>
          </div>
        )}
      </div>

      {/* Price Section */}
      <div className="py-4 border-y border-gray-200 dark:border-gray-700">
        <div className="flex items-baseline gap-4 flex-wrap">
          {/* Current Price with Gradient */}
          <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
            {displayData.price}
          </div>

          {/* MRP */}
          {displayData.mrp && (
            <div className="flex items-center gap-3">
              <span className="text-xl text-gray-500 dark:text-gray-400 line-through">
                {displayData.mrp}
              </span>
              {displayData.discountPercent > 0 && (
                <span className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-bold rounded-full animate-pulse-slow">
                  {displayData.discountPercent}% OFF
                </span>
              )}
            </div>
          )}
        </div>

        {/* Savings */}
        {displayData.mrp && displayData.discountedPrice > 0 && (
          <p className="mt-2 text-sm text-green-600 dark:text-green-400 font-medium">
            You save: {displayData.discountedPrice > 0 ? `₹${displayData.discountedPrice.toFixed(2)}` : ''}
          </p>
        )}
      </div>

      {/* Stock Status */}
      <div className="flex items-center gap-2">
        <div
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold ${
            displayData.stockStatus === 'Out of Stock'
              ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800'
              : displayData.stockStatus === 'Low Stock'
              ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800'
              : 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800'
          }`}
        >
          <div
            className={`w-2 h-2 rounded-full ${
              displayData.stockStatus === 'Out of Stock'
                ? 'bg-red-500'
                : displayData.stockStatus === 'Low Stock'
                ? 'bg-yellow-500 animate-pulse'
                : 'bg-green-500'
            }`}
          />
          {displayData.stockStatus}
        </div>
      </div>

      {/* Short Description with Read More */}
      {displayData.description && (
        <div className="relative">
          <div
            className={`text-gray-600 dark:text-gray-400 leading-relaxed prose dark:prose-invert max-w-none ${
              !isDescriptionExpanded ? 'line-clamp-3' : ''
            }`}
            dangerouslySetInnerHTML={{ __html: displayData.description }}
          />
          {displayData.description.length > 150 && (
            <button
              onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
              className="mt-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold text-sm transition-colors flex items-center gap-1"
            >
              {isDescriptionExpanded ? (
                <>
                  <span>Read Less</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </>
              ) : (
                <>
                  <span>Read More</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductInfo;

