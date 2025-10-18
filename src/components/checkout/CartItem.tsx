import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BagDetail, CartItem as CartItemType } from '../../types/api';
import { useCartItem } from '../../hooks/cart/useCartItem';

interface CartItemProps {
  item: CartItemType;
  isGuest: boolean;
  isUpdating: boolean;
  onIncrement: (uid: string, id?: number) => Promise<void>;
  onDecrement: (uid: string, id?: number) => Promise<void>;
  onRemove: (uid: string, id?: number) => Promise<void>;
  onMoveToWishlist: (uid: string) => Promise<void>;
}

const CartItem: React.FC<CartItemProps> = ({
  item,
  isGuest,
  isUpdating: globalUpdating,
  onIncrement,
  onDecrement,
  onRemove,
  onMoveToWishlist,
}) => {
  const navigate = useNavigate();
  
  const {
    productUid,
    productCount,
    productInfo,
    pricing,
    stockInfo,
    variantInfo,
    units,
    isRemoving,
    isMovingToWishlist,
    isUpdating: localUpdating,
    handleIncrement,
    handleDecrement,
    handleRemove,
    handleMoveToWishlist: handleWishlistMove,
    formatCurrency,
  } = useCartItem({
    item,
    isGuest,
    onIncrement,
    onDecrement,
    onRemove,
    onMoveToWishlist,
    isUpdating: globalUpdating,
  });

  const isDisabled = globalUpdating || localUpdating || isRemoving;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow duration-300 animate-fade-in">
      <div className="flex gap-4">
        {/* Product Image */}
        <div
          className="relative w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 rounded-lg overflow-hidden cursor-pointer group"
          onClick={() => navigate(`/product/${productUid}`)}
        >
          <img
            src={productInfo.productImage}
            alt={productInfo.productName}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          
          {/* Stock Badge */}
          {stockInfo.isOutOfStock && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-white text-sm font-bold">Out of Stock</span>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3
              className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              onClick={() => navigate(`/product/${productUid}`)}
            >
              {productInfo.productName}
            </h3>
            
            {/* Remove Button */}
            <button
              onClick={handleRemove}
              disabled={isDisabled || isRemoving}
              className="flex-shrink-0 p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors disabled:opacity-50"
              aria-label="Remove item"
            >
              {isRemoving ? (
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              )}
            </button>
          </div>

          {/* Variant Info */}
          {variantInfo.variantText && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              {variantInfo.variantText}
            </p>
          )}

          {/* Price Section */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(pricing.price)}
            </span>
            {pricing.mrp > pricing.price && (
              <>
                <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                  {formatCurrency(pricing.mrp)}
                </span>
                {pricing.discountPercent > 0 && (
                  <span className="text-xs font-semibold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded">
                    {pricing.discountPercent}% OFF
                  </span>
                )}
              </>
            )}
          </div>

          {/* Stock Indicator */}
          {stockInfo.isLowStock && !stockInfo.isOutOfStock && (
            <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400 text-sm mb-3">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>Only {stockInfo.stock} left in stock</span>
            </div>
          )}

          {/* Actions Row */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Quantity Controls */}
            <div className="flex items-center border-2 border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
              <button
                onClick={handleDecrement}
                disabled={isDisabled || !stockInfo.canDecrement}
                className={`px-3 py-2 transition-colors ${
                  isDisabled || !stockInfo.canDecrement
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                    : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                }`}
                aria-label="Decrease quantity"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              
              <div className="px-4 py-2 min-w-[3rem] text-center font-semibold text-gray-900 dark:text-white bg-white dark:bg-gray-800 border-x-2 border-gray-300 dark:border-gray-600">
                {productCount}{units ? ` ${units}` : ''}
              </div>
              
              <button
                onClick={handleIncrement}
                disabled={isDisabled || !stockInfo.canIncrement || stockInfo.isOutOfStock}
                className={`px-3 py-2 transition-colors ${
                  isDisabled || !stockInfo.canIncrement || stockInfo.isOutOfStock
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                    : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                }`}
                aria-label="Increase quantity"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>

            {/* Move to Wishlist */}
            {!isGuest && (
              <button
                onClick={handleWishlistMove}
                disabled={isDisabled || isMovingToWishlist}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors disabled:opacity-50"
              >
                {isMovingToWishlist ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span className="hidden sm:inline">Moving...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span className="hidden sm:inline">Move to Wishlist</span>
                  </>
                )}
              </button>
            )}

            {/* Total Price */}
            <div className="ml-auto text-right">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Item Total</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {formatCurrency(pricing.totalPrice)}
              </p>
              {pricing.savings > 0 && (
                <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                  Saved {formatCurrency(pricing.savings)}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;

