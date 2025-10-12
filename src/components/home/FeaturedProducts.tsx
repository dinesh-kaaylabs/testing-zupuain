import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFeaturedProducts } from '../../hooks/product/useFeaturedProducts';
import { useProductUtils } from '../../hooks/product/useProductUtils';
import { useCartActions } from '../../hooks/cart/useCartActions';
import { useWishlistActions } from '../../hooks/wishlist/useWishlistActions';

const FeaturedProducts: React.FC = () => {
  const { products, loading, error } = useFeaturedProducts();
  const { formatProductForDisplay } = useProductUtils();
  const { handleAddToCart } = useCartActions();
  const { isInWishlist, handleToggleWishlist } = useWishlistActions();
  const navigate = useNavigate();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320;
      const newScrollLeft = scrollContainerRef.current.scrollLeft + (direction === 'right' ? scrollAmount : -scrollAmount);
      scrollContainerRef.current.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
    }
  };

  if (error) {
    return null;
  }

  if (loading) {
    return (
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded mb-8 animate-pulse" />
          <div className="flex gap-6 overflow-hidden">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="min-w-[280px] bg-gray-200 dark:bg-gray-700 rounded-xl h-96 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-white dark:bg-gray-800 animate-fade-in">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Featured Products
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Handpicked items just for you
            </p>
          </div>
          <button
            onClick={() => navigate('/products')}
            className="hidden md:flex items-center gap-2 px-6 py-3 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-colors"
          >
            View All
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>

        {/* Horizontal Scroll Container */}
        <div className="relative group">
          {/* Scroll Buttons */}
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white dark:bg-gray-700 shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-gray-50 dark:hover:bg-gray-600 -translate-x-1/2"
            aria-label="Scroll left"
          >
            <svg className="w-6 h-6 text-gray-900 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white dark:bg-gray-700 shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-gray-50 dark:hover:bg-gray-600 translate-x-1/2"
            aria-label="Scroll right"
          >
            <svg className="w-6 h-6 text-gray-900 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Products Scroll */}
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {products.map((product) => {
              const displayData = formatProductForDisplay(product);
              const inWishlist = isInWishlist(product.product_uid);

              return (
                <div
                  key={product.product_uid}
                  className="group min-w-[280px] bg-white dark:bg-gray-700 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden"
                >
                  {/* Image Container */}
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
                    
                    {/* Discount Badge */}
                    {displayData.discountPercent > 0 && (
                      <div className="absolute top-3 left-3 px-3 py-1 bg-red-500 text-white text-sm font-bold rounded-full">
                        -{displayData.discountPercent}%
                      </div>
                    )}

                    {/* Wishlist Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleWishlist(product);
                      }}
                      className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-md flex items-center justify-center transition-all duration-300 hover:scale-110"
                      aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                      <svg
                        className={`w-5 h-5 transition-colors ${
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

                  {/* Product Info */}
                  <div className="p-4 flex flex-col flex-grow">
                    <h3
                      className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      onClick={() => navigate(`/product/${product.product_uid}`)}
                    >
                      {displayData.displayName}
                    </h3>

                    {/* Rating */}
                    {displayData.totalReviews > 0 && (
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center">
                          {[...Array(displayData.ratingStars.filled)].map((_, i) => (
                            <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                            </svg>
                          ))}
                          {displayData.ratingStars.hasHalf && (
                            <svg className="w-4 h-4 text-yellow-400" viewBox="0 0 20 20">
                              <defs>
                                <linearGradient id="half-star">
                                  <stop offset="50%" stopColor="currentColor" />
                                  <stop offset="50%" stopColor="transparent" />
                                </linearGradient>
                              </defs>
                              <path fill="url(#half-star)" d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
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

                    {/* Price */}
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xl font-bold text-gray-900 dark:text-white">
                        {displayData.price}
                      </span>
                      {displayData.mrp && (
                        <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                          {displayData.mrp}
                        </span>
                      )}
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      onClick={() => handleAddToCart(product, displayData)}
                      disabled={!displayData.canAddToCart}
                      className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                        displayData.canAddToCart
                          ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
                          : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {displayData.canAddToCart ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile View All Button */}
        <button
          onClick={() => navigate('/products')}
          className="md:hidden w-full mt-6 px-6 py-3 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-colors flex items-center justify-center gap-2"
        >
          View All Products
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>
      </div>
    </section>
  );
};

export default FeaturedProducts;

