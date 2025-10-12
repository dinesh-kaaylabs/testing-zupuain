import React from 'react';

const CartSkeleton: React.FC = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="animate-pulse">
        {/* Header */}
        <div className="h-10 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-8" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md"
              >
                <div className="flex gap-4">
                  {/* Image */}
                  <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-200 dark:bg-gray-700 rounded-lg flex-shrink-0" />

                  {/* Content */}
                  <div className="flex-1 space-y-3">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
                      <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                      <div className="h-10 w-40 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Coupon Skeleton */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md space-y-4">
              <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="flex gap-2">
                <div className="flex-1 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                <div className="h-12 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg" />
              </div>
            </div>
          </div>

          {/* Pricing Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 space-y-4 sticky top-24">
              <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="space-y-3">
                {[...Array(5)].map((_, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
                    <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
                  </div>
                ))}
              </div>
              <div className="h-12 w-full bg-gray-200 dark:bg-gray-700 rounded-lg mt-6" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartSkeleton;

