import { useMemo } from 'react';
import { getBestSellingProducts } from '../../store/slices/productSlice';
import { BEST_SELLER_PRODUCTS_LIMIT, DEFAULT_SORT_BY_BEST_SELLERS, INITIAL_OFFSET } from '../../utils/constants';
import { useProductData } from './useProductData';

export const useBestSellers = () => {
  const fetchParams = useMemo(() => ({ 
    limit: BEST_SELLER_PRODUCTS_LIMIT,
    offset: INITIAL_OFFSET,
    sort_by: DEFAULT_SORT_BY_BEST_SELLERS,
  }), []);

  return useProductData({
    selector: (state) => ({
      products: state.product.bestSellingProducts,
      loading: state.product.bestSelling.loading,
      error: state.product.bestSelling.error,
    }),
    action: getBestSellingProducts,
    fetchParams,
  });
};
