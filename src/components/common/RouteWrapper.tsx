import React, { Suspense, memo } from 'react';
import RouteErrorBoundary from './RouteErrorBoundary';
import LoadingSpinner from './LoadingSpinner';

interface RouteWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const RouteWrapper = memo(({ children, fallback }: RouteWrapperProps) => (
  <RouteErrorBoundary fallback={fallback}>
    <Suspense fallback={fallback || <LoadingSpinner size="lg" text="Loading page..." />}>
      {children}
    </Suspense>
  </RouteErrorBoundary>
));

RouteWrapper.displayName = 'RouteWrapper';

export default RouteWrapper;
