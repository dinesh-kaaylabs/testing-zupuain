import React, { useState } from 'react';
import { UserCoupon } from '../../types/api';

interface CouponListProps {
  coupons: UserCoupon[];
  onSelectCoupon: (coupon: UserCoupon) => Promise<void>;
  isApplying: boolean;
  formatCurrency: (amount: number) => string;
  previewDiscount: (coupon: UserCoupon) => any;
}

const CouponList: React.FC<CouponListProps> = ({
  coupons,
  onSelectCoupon,
  isApplying,
  formatCurrency,
  previewDiscount,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [applyingCouponId, setApplyingCouponId] = useState<string | null>(null);

  const handleApply = async (coupon: UserCoupon) => {
    setApplyingCouponId(coupon.coupon_id.toString());
    await onSelectCoupon(coupon);
    setApplyingCouponId(null);
  };

  const filteredCoupons = coupons.filter((coupon) => {
    const matchesSearch = searchQuery.trim() === '' ||
      coupon.coupon_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coupon.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = filterType === 'all' || coupon.coupon_type === filterType;
    
    return matchesSearch && matchesType;
  });

  const couponTypes = ['all', 'cart', 'product', 'category', 'free-shipping'];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 space-y-4 animate-fade-in">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
        Available Coupons ({filteredCoupons.length})
      </h3>

      {/* Filters */}
      <div className="space-y-3">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by code or description..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Type Filter */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          {couponTypes.map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
                filterType === type
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Coupon List */}
      <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
        {filteredCoupons.length > 0 ? (
          filteredCoupons.map((coupon) => {
            const discount = previewDiscount(coupon);
            const isCurrentlyApplying = applyingCouponId === coupon.coupon_id.toString();

            return (
              <div
                key={coupon.coupon_id}
                className="border-2 border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-mono font-bold text-sm rounded">
                        {coupon.coupon_code}
                      </span>
                      <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded">
                        {coupon.coupon_type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {coupon.description}
                    </p>
                    {discount && (
                      <p className="text-green-600 dark:text-green-400 font-semibold">
                        Save {formatCurrency(discount.discountAmount)}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleApply(coupon)}
                    disabled={isApplying || isCurrentlyApplying}
                    className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all whitespace-nowrap ${
                      isApplying || isCurrentlyApplying
                        ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 text-white transform hover:scale-105'
                    }`}
                  >
                    {isCurrentlyApplying ? (
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    ) : (
                      'Apply'
                    )}
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <svg className="w-16 h-16 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p>No coupons found matching your search</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CouponList;

