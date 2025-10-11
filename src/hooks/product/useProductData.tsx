import { useAppSelector, useAppDispatch } from '../redux';
import { useEffect, useRef } from 'react';

interface UseProductDataParams {
  selector: (state: any) => { products: any[]; loading: boolean; error: string | null };
  action: any;
  fetchParams: Record<string, any>;
}

export const useProductData = ({ selector, action, fetchParams }: UseProductDataParams) => {
  const dispatch = useAppDispatch();
  const { products, loading, error } = useAppSelector(selector);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!hasInitialized.current && !loading && products.length === 0) {
      hasInitialized.current = true;
      dispatch(action(fetchParams));
    }
  }, [dispatch, loading, action, fetchParams]);

  return {
    products,
    loading,
    error,
    refetch: () => {
      hasInitialized.current = false;
      dispatch(action(fetchParams));
    }
  };
};
