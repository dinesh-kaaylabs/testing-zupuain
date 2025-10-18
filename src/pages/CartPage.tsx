import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import SEOHead from '../components/common/SEOHead';
import { useCart } from '../hooks/cart/useCart';
import CartItem from '../components/checkout/CartItem';
import PricingSummary from '../components/checkout/PricingSummary';
import CouponInput from '../components/checkout/CouponInput';
import CouponList from '../components/checkout/CouponList';
import BestCouponSuggestion from '../components/checkout/BestCouponSuggestion';
import EmptyCart from '../components/checkout/EmptyCart';
import CartSkeleton from '../components/checkout/CartSkeleton';

const CartPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  
  // PRIMARY MEGA-HOOK - integrates useCoupon + usePricing internally
  const {
    cartItems,
    isGuest,
    loading,
    totalItems,
    isUpdating,
    hasInitialized,
    pricing,
    appliedCoupon,
    appliedDiscount,
    totalSavings,
    availableCoupons,
    validCoupons,
    invalidCoupons,
    bestCoupon,
    couponsLoading,
    handleIncrement,
    handleDecrement,
    handleRemove,
    handleMoveToWishlist,
    handleCheckout,
    handleApplyCoupon,
    handleApplyCouponDirect,
    handleRemoveCoupon,
    applyBestCoupon,
    previewDiscount,
    formatCurrency,
    showCouponList,
    handleToggleCouponList,
    handleSelectCoupon,
  } = useCart();

  // Check if we're in Buy Now mode
  const isBuyNowMode = searchParams.get('slug') === 'BUY';

  // Check if any item is being updated
  const isAnyItemUpdating = isUpdating;

  // Loading state
  if (!hasInitialized || loading) {
    return <CartSkeleton />;
  }

  // Empty cart state
  if (cartItems.length === 0) {
    return (
      <>
        <SEOHead
          title="Shopping Cart (0 items)"
          description="Your shopping cart is empty. Browse our products and add items to your cart."
          type="website"
        />
        <EmptyCart />
      </>
    );
  }

  return (
    <>
      <SEOHead
        title={`Shopping Cart (${totalItems} ${totalItems === 1 ? 'item' : 'items'})`}
        description={`Review your cart with ${totalItems} items. Apply coupons and proceed to checkout.`}
        type="website"
      />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {isBuyNowMode ? 'Checkout' : 'Shopping Cart'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {isBuyNowMode 
                ? 'Review your item and proceed to checkout'
                : `${totalItems} ${totalItems === 1 ? 'item' : 'items'} in your cart`
              }
            </p>
            {isBuyNowMode && (
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-lg text-sm font-medium">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Buy Now - Quick Checkout
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Cart Items & Coupons */}
            <div className="lg:col-span-2 space-y-6">
              {/* Cart Items */}
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <CartItem
                    key={'bag_detail_id' in item ? item.bag_detail_id : item.product_uid}
                    item={item}
                    isGuest={isGuest}
                    isUpdating={isAnyItemUpdating}
                    onIncrement={async (uid, id) => handleIncrement(uid, id)}
                    onDecrement={async (uid, id) => handleDecrement(uid, id)}
                    onRemove={async (uid, id) => handleRemove(uid, id)}
                    onMoveToWishlist={handleMoveToWishlist}
                  />
                ))}
              </div>

              {/* Best Coupon Suggestion */}
              {!appliedCoupon && bestCoupon.coupon && bestCoupon.savings > 0 && (
                <BestCouponSuggestion
                  bestCoupon={bestCoupon}
                  onApply={applyBestCoupon}
                  isApplying={couponsLoading}
                  formatCurrency={formatCurrency}
                />
              )}

              {/* Coupon Input */}
              <CouponInput
                availableCoupons={availableCoupons}
                validCoupons={validCoupons}
                invalidCoupons={invalidCoupons}
                appliedCoupon={appliedCoupon}
                appliedDiscount={appliedDiscount}
                bestCoupon={bestCoupon}
                onApplyCoupon={handleApplyCoupon}
                onApplyCouponDirect={handleApplyCouponDirect}
                onRemoveCoupon={handleRemoveCoupon}
                onApplyBestCoupon={applyBestCoupon}
                cartTotal={pricing.subtotal}
                formatCurrency={formatCurrency}
                onToggleCouponList={handleToggleCouponList}
              />

              {/* Coupon List - Shown when toggled */}
              {showCouponList && validCoupons.length > 0 && (
                <CouponList
                  coupons={validCoupons}
                  onSelectCoupon={handleSelectCoupon}
                  isApplying={couponsLoading}
                  formatCurrency={formatCurrency}
                  previewDiscount={previewDiscount}
                />
              )}
            </div>

            {/* Right Column - Pricing Summary */}
            <div className="lg:col-span-1">
              <PricingSummary
                pricing={pricing}
                appliedCoupon={appliedCoupon}
                totalSavings={totalSavings}
                formatCurrency={formatCurrency}
                onCheckout={handleCheckout}
                isCheckoutDisabled={isAnyItemUpdating || cartItems.length === 0}
              />
            </div>
          </div>

          {/* Continue Shopping Link */}
          <div className="mt-8 text-center">
            <a
              href="/products"
              className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Continue Shopping
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartPage;
