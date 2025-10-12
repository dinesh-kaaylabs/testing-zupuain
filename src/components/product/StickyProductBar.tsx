import React, { useState, useEffect } from 'react';
import { ProductDisplayData } from '../../utils/productUtils';

interface StickyProductBarProps {
  displayData: ProductDisplayData;
  isInWishlist: boolean;
  onAddToCart: () => void;
  onToggleWishlist: () => void;
}

const StickyProductBar: React.FC<StickyProductBarProps> = ({
  displayData,
  isInWishlist,
  onAddToCart,
  onToggleWishlist,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky bar after scrolling 400px
      setIsVisible(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-40 bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700 transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3 gap-4">
          {/* Product Info */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <img
              src={displayData.primaryImage}
              alt={displayData.displayName}
              className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
            />
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                {displayData.displayName}
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {displayData.price}
                </span>
                {displayData.mrp && (
                  <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                    {displayData.mrp}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Wishlist Button */}
            <button
              onClick={onToggleWishlist}
              className={`p-3 rounded-lg transition-all duration-300 hidden sm:flex items-center justify-center ${
                isInWishlist
                  ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
              aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <svg
                className={`w-5 h-5 ${isInWishlist ? 'fill-current' : 'fill-none'}`}
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

            {/* Add to Cart Button */}
            <button
              onClick={onAddToCart}
              disabled={!displayData.canAddToCart}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 ${
                displayData.canAddToCart
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transform hover:scale-105'
                  : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="hidden sm:inline">
                {displayData.canAddToCart ? 'Add to Cart' : 'Out of Stock'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StickyProductBar;

