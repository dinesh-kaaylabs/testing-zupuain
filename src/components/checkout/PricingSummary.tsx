import React from 'react';
import { usePricingSummary } from '../../hooks/cart/usePricingSummary';
import { UserCoupon } from '../../types/api';

interface PricingSummaryProps {
  pricing: {
    subtotal: number;
    deliveryCharge: number;
    baseDeliveryCharge: number;
    deliveryDiscount: number;
    productDiscount: number;
    discount: number;
    tax: number;
    total: number;
  };
  appliedCoupon: UserCoupon | null;
  totalSavings: number;
  formatCurrency: (amount: number) => string;
  onCheckout: () => void;
  isCheckoutDisabled: boolean;
}

const PricingSummary: React.FC<PricingSummaryProps> = ({
  pricing,
  appliedCoupon,
  totalSavings,
  formatCurrency,
  onCheckout,
  isCheckoutDisabled,
}) => {
  const { freeShippingInfo } = usePricingSummary({
    subtotal: pricing.subtotal,
    deliveryCharge: pricing.deliveryCharge,
    appliedCoupon,
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 sticky top-24 space-y-6">
      {/* Savings Banner */}
      {totalSavings > 0 && (
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎉</span>
              <div>
                <p className="font-semibold">You're saving</p>
                <p className="text-2xl font-bold">{formatCurrency(totalSavings)}</p>
              </div>
            </div>
            <div className="px-3 py-1 bg-white/20 rounded-full text-sm font-semibold backdrop-blur-sm">
              SAVINGS
            </div>
          </div>
        </div>
      )}

      {/* Free Shipping Progress */}
      {freeShippingInfo.showProgressBar && (
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 animate-fade-in">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
              {formatCurrency(freeShippingInfo.amountForFreeShipping)} away from FREE shipping! 🚚
            </span>
          </div>
          <div className="relative w-full h-2 bg-blue-200 dark:bg-blue-800 rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
              style={{ width: `${freeShippingInfo.progressPercentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Free Shipping Badge */}
      {freeShippingInfo.showBadge && (
        <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-sm font-semibold text-green-700 dark:text-green-300">
            You've got FREE Shipping! 🎉
          </span>
        </div>
      )}

      <h3 className="text-lg font-bold text-gray-900 dark:text-white">Price Details</h3>

      {/* Price Breakdown */}
      <div className="space-y-3">
        {/* Subtotal */}
        <div className="flex items-center justify-between">
          <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
          <span className="font-semibold text-gray-900 dark:text-white">
            {formatCurrency(pricing.subtotal)}
          </span>
        </div>

        {/* Product Discount */}
        {pricing.productDiscount > 0 && (
          <div className="flex items-center justify-between text-green-600 dark:text-green-400">
            <span>Product Discount</span>
            <span className="font-semibold">- {formatCurrency(pricing.productDiscount)}</span>
          </div>
        )}

        {/* Delivery Charge */}
        <div className="flex items-center justify-between">
          <span className="text-gray-600 dark:text-gray-400">Delivery Charge</span>
          <div className="text-right">
            {pricing.deliveryCharge === 0 ? (
              <span className="font-semibold text-green-600 dark:text-green-400">FREE</span>
            ) : (
              <span className="font-semibold text-gray-900 dark:text-white">
                {formatCurrency(pricing.deliveryCharge)}
              </span>
            )}
            {pricing.baseDeliveryCharge > pricing.deliveryCharge && (
              <div className="text-xs text-gray-500 dark:text-gray-400 line-through">
                {formatCurrency(pricing.baseDeliveryCharge)}
              </div>
            )}
          </div>
        </div>

        {/* Delivery Discount */}
        {pricing.deliveryDiscount > 0 && (
          <div className="flex items-center justify-between text-green-600 dark:text-green-400">
            <span>Delivery Discount</span>
            <span className="font-semibold">- {formatCurrency(pricing.deliveryDiscount)}</span>
          </div>
        )}

        {/* Coupon Discount */}
        {appliedCoupon && pricing.discount > 0 && (
          <div className="flex items-center justify-between text-green-600 dark:text-green-400">
            <div className="flex items-center gap-2">
              <span>Coupon Discount</span>
              <span className="text-xs font-mono bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-0.5 rounded">
                {appliedCoupon.coupon_code}
              </span>
            </div>
            <span className="font-semibold">- {formatCurrency(pricing.discount)}</span>
          </div>
        )}

        {/* Tax */}
        {pricing.tax > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-400">Tax</span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {formatCurrency(pricing.tax)}
            </span>
          </div>
        )}

        <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
          <div className="flex items-center justify-between text-lg">
            <span className="font-bold text-gray-900 dark:text-white">Total Amount</span>
            <span className="font-bold text-blue-600 dark:text-blue-400">
              {formatCurrency(pricing.total)}
            </span>
          </div>
        </div>
      </div>

      {/* Checkout Button */}
      <button
        onClick={onCheckout}
        disabled={isCheckoutDisabled}
        className={`w-full py-4 rounded-lg font-semibold text-lg transition-all duration-300 ${
          isCheckoutDisabled
            ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
        }`}
      >
        Proceed to Checkout
      </button>

      {/* Security Badge */}
      <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <span>Safe & Secure Checkout</span>
      </div>
    </div>
  );
};

export default PricingSummary;

