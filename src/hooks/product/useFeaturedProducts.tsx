import { useMemo } from 'react';
import { getFeaturedProducts } from '../../store/slices/productSlice';
import { FEATURED_PRODUCTS_LIMIT, DEFAULT_SORT_BY, INITIAL_OFFSET } from '../../utils/constants';
import { useProductData } from './useProductData';

export const useFeaturedProducts = () => {
  const fetchParams = useMemo(() => ({ 
    limit: FEATURED_PRODUCTS_LIMIT, 
    offset: INITIAL_OFFSET, 
    sort_by: DEFAULT_SORT_BY 
  }), []);

  return useProductData({
    selector: (state) => ({
      products: state.product.featuredProducts,
      loading: state.product.featured.loading,
      error: state.product.featured.error,
    }),
    action: getFeaturedProducts,
    fetchParams,
  });
};
