import { useCallback, useRef } from 'react';

interface RetryOptions {
  maxRetries?: number;
  baseDelay?: number;
  maxDelay?: number;
  backoffMultiplier?: number;
}

export const useSmartRetry = (options: RetryOptions = {}) => {
  const { maxRetries = 3, baseDelay = 1000, maxDelay = 10000, backoffMultiplier = 2 } = options;
  const retryCountRef = useRef<Map<string, number>>(new Map());

  const executeWithRetry = useCallback(async (
    key: string,
    operation: () => Promise<any>,
    onRetry?: (attempt: number, error: Error) => void
  ): Promise<any> => {
    const retryCount = retryCountRef.current.get(key) || 0;
    
    try {
      const result = await operation();
      retryCountRef.current.delete(key);
      return result;
    } catch (error) {
      if (retryCount < maxRetries) {
        const delay = Math.min(baseDelay * Math.pow(backoffMultiplier, retryCount), maxDelay);
        retryCountRef.current.set(key, retryCount + 1);
        onRetry?.(retryCount + 1, error as Error);
        await new Promise(resolve => setTimeout(resolve, delay));
        return executeWithRetry(key, operation, onRetry);
      }
      retryCountRef.current.delete(key);
      throw error;
    }
  }, [maxRetries, baseDelay, maxDelay, backoffMultiplier]);

  return { executeWithRetry, resetRetryCount: (key: string) => retryCountRef.current.delete(key) };
};
