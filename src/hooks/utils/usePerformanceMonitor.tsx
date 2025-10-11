import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export const usePerformanceMonitor = (componentName: string) => {
  const startTime = useRef<number>(Date.now());
  const renderStartTime = useRef<number>(Date.now());

  useEffect(() => {
    const loadTime = Date.now() - startTime.current;
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`Performance [${componentName}]: ${loadTime}ms`);
    } else if (window.gtag) {
      window.gtag('event', 'timing_complete', { name: componentName, value: loadTime });
    }
  }, [componentName]);

  const markRenderStart = () => { renderStartTime.current = Date.now(); };
  const markRenderEnd = () => {
    const renderTime = Date.now() - renderStartTime.current;
    if (process.env.NODE_ENV === 'development') {
      console.log(`Render Time [${componentName}]: ${renderTime}ms`);
    }
  };

  return { markRenderStart, markRenderEnd };
};

export const useWebVitals = () => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('web-vitals').then(({ onCLS, onFCP, onLCP, onTTFB }) => {
        [onCLS, onFCP, onLCP, onTTFB].forEach(metric => metric(console.log));
      });
    }
  }, []);
};
