import React, { useEffect, useRef } from 'react';

interface InfiniteScrollProps {
  hasMore: boolean;
  loading: boolean;
  onLoadMore: () => void;
}

const InfiniteScroll: React.FC<InfiniteScrollProps> = ({
  hasMore,
  loading,
  onLoadMore,
}) => {
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Only trigger if the element is intersecting, has more data, and is not currently loading
        if (entries[0].isIntersecting && hasMore && !loading) {
          onLoadMore();
        }
      },
      {
        root: null, // viewport
        rootMargin: '100px', // Trigger 100px before reaching the target
        threshold: 0.1,
      }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, loading, onLoadMore]);

  if (!hasMore && !loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
          <svg
            className="w-8 h-8 text-gray-400 dark:text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <p className="text-gray-600 dark:text-gray-400 font-medium">
          You've reached the end
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
          No more products to load
        </p>
      </div>
    );
  }

  return (
    <div className="py-8">
      {/* Observer Target */}
      <div ref={observerTarget} className="h-20" />

      {/* Loading Indicator */}
      {loading && (
        <div className="flex flex-col items-center justify-center">
          {/* Spinner */}
          <div className="relative w-16 h-16 mb-4">
            <div className="absolute inset-0 border-4 border-gray-200 dark:border-gray-700 rounded-full" />
            <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>

          {/* Loading Text */}
          <p className="text-gray-600 dark:text-gray-400 font-medium animate-pulse">
            Loading more products...
          </p>

          {/* Loading Dots */}
          <div className="flex items-center gap-2 mt-3">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      )}

      {/* Load More Button - Fallback for browsers without Intersection Observer */}
      {hasMore && !loading && (
        <div className="text-center">
          <button
            onClick={onLoadMore}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
          >
            Load More Products
          </button>
        </div>
      )}
    </div>
  );
};

export default InfiniteScroll;

