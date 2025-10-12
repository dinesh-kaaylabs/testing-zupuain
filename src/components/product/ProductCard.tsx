import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../../types/api';
import { ProductDisplayData } from '../../utils/productUtils';

interface ProductCardProps {
  product: Product;
  displayData: ProductDisplayData;
  viewMode: 'grid' | 'list';
  isInWishlist: boolean;
  onAddToCart: () => void;
  onToggleWishlist: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  displayData,
  viewMode,
  isInWishlist,
  onAddToCart,
  onToggleWishlist,
}) => {
  const navigate = useNavigate();

  const stockColorClass = useMemo(() => {
    if (displayData.stockStatus === 'Out of Stock') {
      return 'text-red-600 bg-red-50 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800';
    }
    if (displayData.stockStatus === 'Low Stock') {
      return 'text-yellow-600 bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800';
    }
    return 'text-green-600 bg-green-50 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800';
  }, [displayData.stockStatus]);

  if (viewMode === 'list') {
    return (
      <div className="group bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col sm:flex-row animate-fade-in">
        {/* Image */}
        <div
          className="relative w-full sm:w-48 h-48 sm:h-auto flex-shrink-0 overflow-hidden cursor-pointer"
          onClick={() => navigate(`/product/${product.product_uid}`)}
        >
          <img
            src={displayData.primaryImage}
            alt={displayData.displayName}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          <img
            src={displayData.secondaryImage}
            alt={displayData.displayName}
            className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            loading="lazy"
          />
          
          {displayData.discountPercent > 0 && (
            <div className="absolute top-3 left-3 px-3 py-1 bg-red-500 text-white text-sm font-bold rounded-full">
              -{displayData.discountPercent}%
            </div>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist();
            }}
            className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-md flex items-center justify-center transition-all duration-300 hover:scale-110"
            aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <svg
              className={`w-5 h-5 transition-colors ${
                isInWishlist ? 'fill-red-500 text-red-500' : 'fill-none text-gray-600 dark:text-gray-300'
              }`}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-4 mb-2">
              <h3
                className="text-xl font-semibold text-gray-900 dark:text-white line-clamp-2 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex-1"
                onClick={() => navigate(`/product/${product.product_uid}`)}
              >
                {displayData.displayName}
              </h3>
              <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${stockColorClass} whitespace-nowrap`}>
                {displayData.stockStatus}
              </span>
            </div>

            {displayData.brand && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                Brand: {displayData.brand}
              </p>
            )}

            {displayData.totalReviews > 0 && (
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center">
                  {[...Array(displayData.ratingStars.filled)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                  {displayData.ratingStars.hasHalf && (
                    <svg className="w-4 h-4 text-yellow-400" viewBox="0 0 20 20">
                      <defs>
                        <linearGradient id={`half-star-list-${product.product_uid}`}>
                          <stop offset="50%" stopColor="currentColor" />
                          <stop offset="50%" stopColor="transparent" />
                        </linearGradient>
                      </defs>
                      <path fill={`url(#half-star-list-${product.product_uid})`} d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  )}
                  {[...Array(displayData.ratingStars.empty)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-gray-300 dark:text-gray-600 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {displayData.averageRating.toFixed(1)} ({displayData.totalReviews})
                </span>
              </div>
            )}

            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
              {displayData.description}
            </p>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {displayData.price}
              </span>
              {displayData.mrp && (
                <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                  {displayData.mrp}
                </span>
              )}
            </div>

            <button
              onClick={onAddToCart}
              disabled={!displayData.canAddToCart}
              className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${
                displayData.canAddToCart
                  ? 'bg-blue-600 hover:bg-blue-700 text-white transform hover:scale-105'
                  : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              }`}
            >
              {displayData.canAddToCart ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div className="group bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden animate-fade-in">
      {/* Image */}
      <div
        className="relative aspect-square overflow-hidden cursor-pointer"
        onClick={() => navigate(`/product/${product.product_uid}`)}
      >
        <img
          src={displayData.primaryImage}
          alt={displayData.displayName}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <img
          src={displayData.secondaryImage}
          alt={displayData.displayName}
          className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          loading="lazy"
        />
        
        {displayData.discountPercent > 0 && (
          <div className="absolute top-3 left-3 px-3 py-1 bg-red-500 text-white text-sm font-bold rounded-full">
            -{displayData.discountPercent}%
          </div>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist();
          }}
          className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-md flex items-center justify-center transition-all duration-300 hover:scale-110"
          aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <svg
            className={`w-5 h-5 transition-colors ${
              isInWishlist ? 'fill-red-500 text-red-500' : 'fill-none text-gray-600 dark:text-gray-300'
            }`}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>

        {/* Stock Badge */}
        <div className={`absolute bottom-3 left-3 px-3 py-1 text-xs font-semibold rounded-full border backdrop-blur-sm ${stockColorClass}`}>
          {displayData.stockStatus}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        <h3
          className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors min-h-[3.5rem]"
          onClick={() => navigate(`/product/${product.product_uid}`)}
        >
          {displayData.displayName}
        </h3>

        {displayData.brand && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            {displayData.brand}
          </p>
        )}

        {displayData.totalReviews > 0 && (
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center">
              {[...Array(displayData.ratingStars.filled)].map((_, i) => (
                <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              ))}
              {displayData.ratingStars.hasHalf && (
                <svg className="w-4 h-4 text-yellow-400" viewBox="0 0 20 20">
                  <defs>
                    <linearGradient id={`half-star-grid-${product.product_uid}`}>
                      <stop offset="50%" stopColor="currentColor" />
                      <stop offset="50%" stopColor="transparent" />
                    </linearGradient>
                  </defs>
                  <path fill={`url(#half-star-grid-${product.product_uid})`} d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              )}
              {[...Array(displayData.ratingStars.empty)].map((_, i) => (
                <svg key={i} className="w-4 h-4 text-gray-300 dark:text-gray-600 fill-current" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              ))}
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              ({displayData.totalReviews})
            </span>
          </div>
        )}

        <div className="flex items-center gap-2 mb-4 mt-auto">
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            {displayData.price}
          </span>
          {displayData.mrp && (
            <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
              {displayData.mrp}
            </span>
          )}
        </div>

        <button
          onClick={onAddToCart}
          disabled={!displayData.canAddToCart}
          className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${
            displayData.canAddToCart
              ? 'bg-blue-600 hover:bg-blue-700 text-white transform hover:scale-105 shadow-md hover:shadow-lg'
              : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
          }`}
        >
          {displayData.canAddToCart ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;

