import { useMemo } from 'react';
import { useAppSelector } from '../redux/useAppSelector';
import { Category, Product, ProductRating } from '../../types/api';
import { CategoryDisplayData, formatCategoryForDisplay, formatProductForDisplay, ProductDisplayData } from '../../utils/productUtils';

export const useProductUtils = () => {
  const { defaultTenant } = useAppSelector((state) => state.tenant);
  
  return useMemo(() => ({
    formatProductForDisplay: (product: Product, ratings: ProductRating[] = []) => 
      formatProductForDisplay(product, defaultTenant, ratings),
  }), [defaultTenant]);
};

export const useProductDisplayData = (product: Product): ProductDisplayData => {
  const { productReviews } = useAppSelector((state) => state.product);
  const { defaultTenant } = useAppSelector((state) => state.tenant);
  
  const productRatings = useMemo(() => 
    productReviews.filter(review => review.product_uid === product.product_uid),
    [productReviews, product.product_uid]
  );
  
  return useMemo(() => 
    formatProductForDisplay(product, defaultTenant, productRatings),
    [product, defaultTenant, productRatings]
  );
};

export const useCategoryDisplayData = (category: Category): CategoryDisplayData => {
  const displayData = useMemo(() => {
    return formatCategoryForDisplay(category);
  }, [category]);

  return displayData;
};
