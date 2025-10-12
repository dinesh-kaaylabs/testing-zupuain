const WishlistSkeleton = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Skeleton */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="h-8 w-40 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
              <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
            <div className="flex gap-3">
              <div className="h-10 w-64 bg-gray-200 dark:bg-gray-700 rounded-lg" />
              <div className="h-10 w-40 bg-gray-200 dark:bg-gray-700 rounded-lg" />
            </div>
          </div>
        </div>

        {/* Bulk Actions Skeleton */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 animate-pulse">
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded-lg" />
              <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
            <div className="flex gap-3">
              <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded-lg" />
              <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg" />
            </div>
          </div>
        </div>

        {/* Grid Skeleton - 8 cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden animate-pulse"
            >
              {/* Image Skeleton */}
              <div className="aspect-square bg-gray-200 dark:bg-gray-700" />

              {/* Content Skeleton */}
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WishlistSkeleton;

