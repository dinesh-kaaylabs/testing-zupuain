import React from 'react';
import { ProductDisplayData } from '../../utils/productUtils';
import { VariantDisplayData } from '../../hooks/product/useProductVariants';

interface PurchaseSectionProps {
  displayData: ProductDisplayData;
  isInWishlist: boolean;
  quantity: number;
  isBuying: boolean;
  onAddToCart: () => void;
  onToggleWishlist: () => void;
  onBuyNow: () => void;
  onQuantityIncrement: () => void;
  onQuantityDecrement: () => void;
  onQuantityChange: (value: number) => void;
  variantDisplayData?: VariantDisplayData | null;
}

const PurchaseSection: React.FC<PurchaseSectionProps> = ({
  displayData,
  isInWishlist,
  quantity,
  isBuying,
  onAddToCart,
  onToggleWishlist,
  onBuyNow,
  onQuantityIncrement,
  onQuantityDecrement,
  onQuantityChange,
  variantDisplayData,
}) => {
  // Use variant data if available, otherwise fall back to product data
  const effectiveDisplayData = variantDisplayData || displayData;

  const handleQuantityInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= displayData.minOrderQuantity) {
      onQuantityChange(value);
    }
  };

  return (
    <div className="space-y-6 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      {/* Quantity Selector */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Quantity
        </label>
        <div className="flex items-center gap-4">
          {/* Quantity Controls */}
          <div className="flex items-center border-2 border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
            <button
              onClick={onQuantityDecrement}
              disabled={quantity <= displayData.minOrderQuantity || !effectiveDisplayData.canAddToCart}
              className={`px-4 py-3 transition-colors ${
                quantity <= displayData.minOrderQuantity || !effectiveDisplayData.canAddToCart
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                  : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
              }`}
              aria-label="Decrease quantity"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <input
              type="number"
              value={quantity}
              onChange={handleQuantityInputChange}
              disabled={!effectiveDisplayData.canAddToCart}
              min={displayData.minOrderQuantity}
              className="w-20 px-4 py-3 text-center text-lg font-semibold bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-x-2 border-gray-300 dark:border-gray-600 focus:outline-none disabled:opacity-50"
              aria-label="Quantity"
            />
            <button
              onClick={onQuantityIncrement}
              disabled={!effectiveDisplayData.canAddToCart}
              className={`px-4 py-3 transition-colors ${
                !effectiveDisplayData.canAddToCart
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                  : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
              }`}
              aria-label="Increase quantity"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>

          {/* Min Order Quantity Note */}
          {displayData.minOrderQuantity > 1 && (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Min: {displayData.minOrderQuantity}
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        {/* Buy Now and Add to Cart Buttons - Side by Side */}
        <div className="grid grid-cols-2 gap-3">
          {/* Buy Now Button */}
          <button
            onClick={onBuyNow}
            disabled={!effectiveDisplayData.canAddToCart || isBuying}
            className={`py-4 rounded-lg font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
              effectiveDisplayData.canAddToCart && !isBuying
                ? 'bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed'
            }`}
          >
            {isBuying ? (
              <>
                <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span className="text-base">Processing...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="text-base">Buy Now</span>
              </>
            )}
          </button>

          {/* Add to Cart Button */}
          <button
            onClick={onAddToCart}
            disabled={!effectiveDisplayData.canAddToCart}
            className={`py-4 rounded-lg font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
              effectiveDisplayData.canAddToCart
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="text-base">{effectiveDisplayData.canAddToCart ? 'Add to Cart' : 'Out of Stock'}</span>
          </button>
        </div>

        {/* Wishlist Button */}
        <button
          onClick={onToggleWishlist}
          className={`w-full py-4 rounded-lg font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-3 border-2 ${
            isInWishlist
              ? 'bg-red-50 dark:bg-red-900/20 border-red-500 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30'
              : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-red-500 hover:text-red-600 dark:hover:text-red-400'
          }`}
        >
          <svg
            className={`w-6 h-6 transition-colors ${isInWishlist ? 'fill-current' : 'fill-none'}`}
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
          {isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
        </button>
      </div>

      {/* Additional Info */}
      <div className="pt-6 border-t border-gray-200 dark:border-gray-700 space-y-3">
        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
          <svg className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>Secure checkout</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
          <svg className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span>100% Authentic products</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
          <svg className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
          </svg>
          <span>Easy returns within 30 days</span>
        </div>
      </div>
    </div>
  );
};

export default PurchaseSection;

