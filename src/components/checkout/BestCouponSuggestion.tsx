import React from 'react';
import { UserCoupon } from '../../types/api';

interface BestCouponSuggestionProps {
  bestCoupon: {
    coupon: UserCoupon | null;
    savings: number;
  };
  onApply: () => void;
  isApplying: boolean;
  formatCurrency: (amount: number) => string;
}

const BestCouponSuggestion: React.FC<BestCouponSuggestionProps> = ({
  bestCoupon,
  onApply,
  isApplying,
  formatCurrency,
}) => {
  if (!bestCoupon.coupon || bestCoupon.savings === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border-2 border-amber-300 dark:border-amber-700 rounded-xl p-4 shadow-lg animate-pulse-slow">
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center animate-bounce-slow">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wide">
              Best Offer
            </span>
            <span className="inline-flex px-2 py-0.5 bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200 text-xs font-bold rounded-full animate-pulse">
              RECOMMENDED
            </span>
          </div>
          
          <div className="mb-2">
            <span className="font-mono font-bold text-amber-900 dark:text-amber-100 text-lg">
              {bestCoupon.coupon.coupon_code}
            </span>
          </div>
          
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-2 line-clamp-2">
            {bestCoupon.coupon.description}
          </p>
          
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-green-600 dark:text-green-400">
              Save {formatCurrency(bestCoupon.savings)}
            </span>
            <span className="text-2xl">🎉</span>
          </div>
        </div>

        {/* Apply Button */}
        <button
          onClick={onApply}
          disabled={isApplying}
          className={`flex-shrink-0 px-6 py-3 rounded-lg font-bold transition-all duration-300 ${
            isApplying
              ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white shadow-md hover:shadow-lg transform hover:scale-105'
          }`}
        >
          {isApplying ? (
            <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : (
            <>
              <span className="hidden sm:inline">Apply Now</span>
              <span className="sm:hidden">Apply</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default BestCouponSuggestion;

