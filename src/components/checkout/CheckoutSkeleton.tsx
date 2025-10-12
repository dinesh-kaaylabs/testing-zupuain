export const CheckoutSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-4 sm:py-8 animate-pulse">
      <div className="container mx-auto px-4">
        {/* Progress Bar Skeleton */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-gray-300 dark:bg-gray-700 rounded-full" />
                  <div className="mt-2 w-16 h-4 bg-gray-300 dark:bg-gray-700 rounded" />
                </div>
                {i < 4 && <div className="flex-1 h-0.5 mx-4 bg-gray-300 dark:bg-gray-700" />}
              </div>
            ))}
          </div>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main content - 2 columns */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6">
              {/* Header */}
              <div className="mb-6">
                <div className="h-8 w-48 bg-gray-300 dark:bg-gray-700 rounded mb-2" />
                <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>

              {/* Content Area */}
              <div className="space-y-4">
                {/* Address Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[1, 2].map((i) => (
                    <div
                      key={i}
                      className="p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg"
                    >
                      <div className="h-5 w-20 bg-gray-300 dark:bg-gray-700 rounded mb-3" />
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Additional skeleton rows */}
                <div className="space-y-3 pt-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                  ))}
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="h-11 w-24 bg-gray-300 dark:bg-gray-700 rounded-lg" />
                <div className="h-11 w-32 bg-gray-300 dark:bg-gray-700 rounded-lg" />
              </div>
            </div>
          </div>

          {/* Sidebar - 1 column */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24">
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md p-6">
                {/* Header */}
                <div className="flex items-center space-x-2 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="w-5 h-5 bg-gray-300 dark:bg-gray-700 rounded" />
                  <div className="h-6 w-32 bg-gray-300 dark:bg-gray-700 rounded" />
                </div>

                {/* Items Preview */}
                <div className="space-y-3 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center space-x-2">
                      <div className="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price rows */}
                <div className="space-y-3 mb-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex justify-between">
                      <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
                      <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="pt-4 border-t-2 border-gray-300 dark:border-gray-600">
                  <div className="flex justify-between items-center">
                    <div className="h-5 w-24 bg-gray-300 dark:bg-gray-700 rounded" />
                    <div className="h-8 w-24 bg-gray-300 dark:bg-gray-700 rounded" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

