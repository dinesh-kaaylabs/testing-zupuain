import { useMemo } from 'react';
import { useProductUtils } from '../product/useProductUtils';
import type { Product } from '../../types/api';
import type { ProductDisplayData } from '../../utils/productUtils';

interface UseWishlistDisplayDataParams {
  products: Product[];
}

interface UseWishlistDisplayDataReturn {
  displayDataMap: Map<string, ProductDisplayData>;
}

export const useWishlistDisplayData = ({
  products,
}: UseWishlistDisplayDataParams): UseWishlistDisplayDataReturn => {
  const { formatProductForDisplay } = useProductUtils();

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
