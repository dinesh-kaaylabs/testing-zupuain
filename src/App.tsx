import React, { memo, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import ToastProvider from './components/ui/ToastProvider';
import InvalidTokenProvider from './components/common/InvalidTokenProvider';
import { ThemeProvider } from './contexts/ThemeContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import RouteWrapper from './components/common/RouteWrapper';
import SEOHead from './components/common/SEOHead';
import LayoutWrapper from './components/layout/LayoutWrapper';
import { useWebVitals, usePerformanceMonitor, useAppRoutes } from './hooks';
import { fetchTenant } from './store/slices/tenantSlice';
import { fetchStores } from './store/slices/storeSlice';
import { AppDispatch } from './store/store';

const App = memo(() => {
  const dispatch = useDispatch<AppDispatch>();
  const { markRenderStart, markRenderEnd } = usePerformanceMonitor('App');
  
  // Initialize app
  const init = useCallback(() => {
    dispatch(fetchTenant());
    dispatch(fetchStores());
    // Preload critical pages
    setTimeout(() => {
      import('./pages/ProductListPage');
      import('./pages/CartPage');
    }, 2000);
  }, [dispatch]);

  useEffect(() => {
    markRenderStart();
    init();
    const timer = setTimeout(markRenderEnd, 100);
    return () => clearTimeout(timer);
  }, [init, markRenderStart, markRenderEnd]);

  useWebVitals();
  const routes = useAppRoutes();

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <Router>
          <SEOHead />
          <ToastProvider />
          <InvalidTokenProvider>
            <Routes>
              {routes.map(({ path, element, fallback, layout = true }) => (
                <Route
                  key={path}
                  path={path}
                  element={
                    <LayoutWrapper showHeader={layout} showFooter={layout}>
                      <RouteWrapper fallback={fallback}>
                        {element}
                      </RouteWrapper>
                    </LayoutWrapper>
                  }
                />
              ))}
            </Routes>
          </InvalidTokenProvider>
        </Router>
      </ThemeProvider>
    </ErrorBoundary>
  );
});

App.displayName = 'App';

export default App;
