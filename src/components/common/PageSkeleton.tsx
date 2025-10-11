import React from 'react';

interface PageSkeletonProps {
  type?: 'home' | 'product' | 'list' | 'account';
}

const PageSkeleton: React.FC<PageSkeletonProps> = ({ type = 'home' }) => {
  const skeletonClass = "bg-gray-200 dark:bg-gray-700 rounded";
  const SkeletonBox = ({ className = "", ...props }: any) => <div className={`${skeletonClass} ${className}`} {...props} />;

  const skeletons = {
    home: (
      <div className="animate-pulse">
        <SkeletonBox className="h-96 mb-8" />
        <div className="mb-8">
          <SkeletonBox className="h-8 w-48 mb-4" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <SkeletonBox key={i} className="h-32" />)}
          </div>
        </div>
        <div className="mb-8">
          <SkeletonBox className="h-8 w-48 mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => <SkeletonBox key={i} className="h-64" />)}
          </div>
        </div>
      </div>
    ),
    product: (
      <div className="animate-pulse">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SkeletonBox className="h-96" />
          <div className="space-y-4">
            <SkeletonBox className="h-8 w-3/4" />
            <SkeletonBox className="h-4 w-1/2" />
            <SkeletonBox className="h-4 w-1/3" />
            <SkeletonBox className="h-12 w-1/4" />
          </div>
        </div>
      </div>
    ),
    list: (
      <div className="animate-pulse">
        <div className="flex justify-between items-center mb-6">
          <SkeletonBox className="h-8 w-48" />
          <SkeletonBox className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(12)].map((_, i) => <SkeletonBox key={i} className="h-64" />)}
        </div>
      </div>
    ),
    account: (
      <div className="animate-pulse">
        <div className="max-w-4xl mx-auto">
          <SkeletonBox className="h-8 w-48 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1"><SkeletonBox className="h-64" /></div>
            <div className="md:col-span-2 space-y-4">
              <SkeletonBox className="h-6 w-1/2" />
              <SkeletonBox className="h-4 w-3/4" />
              <SkeletonBox className="h-4 w-1/2" />
            </div>
          </div>
        </div>
      </div>
    )
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {skeletons[type]}
      </div>
    </div>
  );
};

export default PageSkeleton;
