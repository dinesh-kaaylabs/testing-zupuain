import { useMemo } from 'react';
import { useProductUtils } from '../product/useProductUtils';
import type { Product } from '../../types/api';
import type { ProductDisplayData } from '../../utils/productUtils';

interface UseWishlistDisplayDataProps {
  products: Product[];
}

interface UseWishlistDisplayDataReturn {
  displayDataMap: Map<string, ProductDisplayData>;
}

export const useWishlistDisplayData = ({ products }: UseWishlistDisplayDataProps): UseWishlistDisplayDataReturn => {
  const { formatProductForDisplay } = useProductUtils();

  // Create display data map for all products
  const displayDataMap = useMemo(() => {
    const map = new Map<string, ProductDisplayData>();
    products.forEach((product) => {
      const displayData = formatProductForDisplay(product);
      map.set(product.product_uid, displayData);
    });
    return map;
  }, [products, formatProductForDisplay]);

  return { displayDataMap };
};
