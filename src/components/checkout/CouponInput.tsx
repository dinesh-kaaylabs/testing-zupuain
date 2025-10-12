import React from 'react';
import { UserCoupon } from '../../types/api';
import { useCouponInput } from '../../hooks/cart/useCouponInput';
import { CouponDiscountResult } from '../../utils/couponUtils';

interface CouponInputProps {
  availableCoupons: UserCoupon[];
  validCoupons: UserCoupon[];
  invalidCoupons: Array<{ coupon: UserCoupon; validation: { message?: string } }>;
  appliedCoupon: UserCoupon | null;
  appliedDiscount: CouponDiscountResult | null;
  bestCoupon: { coupon: UserCoupon | null; savings: number };
  onApplyCoupon: (code: string) => Promise<boolean>;
  onApplyCouponDirect: (coupon: UserCoupon) => Promise<boolean>;
  onRemoveCoupon: () => void;
  onApplyBestCoupon: () => void;
  cartTotal: number;
  formatCurrency: (amount: number) => string;
  onToggleCouponList?: (show: boolean) => void;
}

const CouponInput: React.FC<CouponInputProps> = (props) => {
  const {
    appliedCoupon,
    appliedDiscount,
    formatCurrency,
  } = props;

  const {
    couponCode,
    error,
    isApplying,
    showAllCoupons,
    handleApplyCoupon,
    handleRemoveCoupon,
    handleCouponCodeChange,
    toggleShowAllCoupons,
  } = useCouponInput(props);

  // Notify parent component when showAllCoupons changes
  React.useEffect(() => {
    if (props.onToggleCouponList) {
      props.onToggleCouponList(showAllCoupons);
    }
  }, [showAllCoupons, props.onToggleCouponList]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 space-y-4">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
        <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
        Apply Coupon
      </h3>

      {/* Applied Coupon Display */}
      {appliedCoupon && appliedDiscount ? (
        <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-500 dark:border-green-600 rounded-lg p-4 animate-fade-in">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-mono font-bold text-green-700 dark:text-green-300">
                  {appliedCoupon.coupon_code}
                </span>
              </div>
              <p className="text-sm text-green-700 dark:text-green-300 mb-2">
                {appliedCoupon.description}
              </p>
              <p className="text-lg font-bold text-green-600 dark:text-green-400">
                You saved {formatCurrency(appliedDiscount.discountAmount)}! 🎉
              </p>
            </div>
            <button
              onClick={handleRemoveCoupon}
              className="flex-shrink-0 p-2 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors"
              aria-label="Remove coupon"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Coupon Code Input */}
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => handleCouponCodeChange(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleApplyCoupon()}
                placeholder="Enter coupon code"
                disabled={isApplying}
                className="flex-1 px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 font-mono uppercase focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 transition-all"
              />
              <button
                onClick={handleApplyCoupon}
                disabled={isApplying || !couponCode.trim()}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 whitespace-nowrap ${
                  isApplying || !couponCode.trim()
                    ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white transform hover:scale-105'
                }`}
              >
                {isApplying ? (
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  'Apply'
                )}
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm animate-fade-in">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* View All Coupons Button */}
          {props.validCoupons.length > 0 && (
            <button
              onClick={toggleShowAllCoupons}
              className="w-full py-3 border-2 border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-400 rounded-lg font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              {showAllCoupons ? 'Hide' : 'View All'} Available Coupons ({props.validCoupons.length})
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default CouponInput;

