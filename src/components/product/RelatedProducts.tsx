import React, { useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../../types/api';
import { useProductUtils } from '../../hooks/product/useProductUtils';
import { useCartActions } from '../../hooks/cart/useCartActions';
import { useWishlistActions } from '../../hooks/wishlist/useWishlistActions';

interface RelatedProductsProps {
  products: Product[];
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ products }) => {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const { formatProductForDisplay } = useProductUtils();
  const { handleAddToCart } = useCartActions();
  const { isInWishlist, handleToggleWishlist } = useWishlistActions();

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      const newScrollLeft = scrollRef.current.scrollLeft + (direction === 'right' ? scrollAmount : -scrollAmount);
      scrollRef.current.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
    }
  };

  // Format all products for display
  const formattedProducts = useMemo(() => {
    return products.map((product) => ({
      product,
      displayData: formatProductForDisplay(product),
    }));
  }, [products, formatProductForDisplay]);

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          You May Also Like
        </h2>
      </div>

      {/* Carousel */}
      <div className="relative group">
        {/* Scroll Buttons */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 rounded-full bg-white dark:bg-gray-700 shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-gray-50 dark:hover:bg-gray-600"
          aria-label="Scroll left"
        >
          <svg className="w-6 h-6 text-gray-900 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 rounded-full bg-white dark:bg-gray-700 shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-gray-50 dark:hover:bg-gray-600"
          aria-label="Scroll right"
        >
          <svg className="w-6 h-6 text-gray-900 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Products */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {formattedProducts.map(({ product, displayData }) => {
            const inWishlist = isInWishlist(product.product_uid);

            return (
              <div
                key={product.product_uid}
                className="group min-w-[240px] bg-gray-50 dark:bg-gray-700 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col"
              >
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

                  {displayData.discountPercent > 0 && (
                    <div className="absolute top-2 left-2 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                      -{displayData.discountPercent}%
                    </div>
                  )}

                  {/* Wishlist Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleWishlist(product);
                    }}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white dark:bg-gray-800 shadow-md flex items-center justify-center transition-all duration-300 hover:scale-110"
                    aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                  >
                    <svg
                      className={`w-4 h-4 transition-colors ${
                        inWishlist ? 'fill-red-500 text-red-500' : 'fill-none text-gray-600 dark:text-gray-300'
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
                <div className="p-4 flex flex-col flex-grow">
                  <h3
                    className="text-sm font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors min-h-[2.5rem]"
                    onClick={() => navigate(`/product/${product.product_uid}`)}
                  >
                    {displayData.displayName}
                  </h3>

                  {displayData.totalReviews > 0 && (
                    <div className="flex items-center gap-1 mb-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-3 h-3 ${
                              i < displayData.ratingStars.filled ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-gray-600 fill-current'
                            }`}
                            viewBox="0 0 20 20"
                          >
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        ({displayData.totalReviews})
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 mb-3 mt-auto">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      {displayData.price}
                    </span>
                    {displayData.mrp && (
                      <span className="text-xs text-gray-500 dark:text-gray-400 line-through">
                        {displayData.mrp}
                      </span>
                    )}
                  </div>

                  {/* Quick Add Button */}
                  <button
                    onClick={() => handleAddToCart(product, displayData)}
                    disabled={!displayData.canAddToCart}
                    className={`w-full py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                      displayData.canAddToCart
                        ? 'bg-blue-600 hover:bg-blue-700 text-white transform hover:scale-105'
                        : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {displayData.canAddToCart ? 'Quick Add' : 'Out of Stock'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RelatedProducts;

