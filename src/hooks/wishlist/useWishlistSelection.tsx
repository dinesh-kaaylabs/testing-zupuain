import { useState, useCallback, useMemo } from 'react';
import type { Product } from '../../types/api';

interface UseWishlistSelectionParams {
  products: Product[];
}

interface UseWishlistSelectionReturn {
  selectedItems: Set<string>;
  selectedCount: number;
  handleToggleSelect: (productUid: string) => void;
  handleSelectAll: () => void;
  handleDeselectAll: () => void;
  clearSelection: () => void;
}

export const useWishlistSelection = ({
  products,
}: UseWishlistSelectionParams): UseWishlistSelectionReturn => {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const selectedCount = useMemo(() => selectedItems.size, [selectedItems]);

  const handleToggleSelect = useCallback((productUid: string) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(productUid)) {
        newSet.delete(productUid);
      } else {
        newSet.add(productUid);
      }
      return newSet;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    const allIds = new Set(products.map((product) => product.product_uid));
    setSelectedItems(allIds);
  }, [products]);

  const handleDeselectAll = useCallback(() => {
    setSelectedItems(new Set());
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedItems(new Set());
  }, []);

  return {
    selectedItems,
    selectedCount,
    handleToggleSelect,
    handleSelectAll,
    handleDeselectAll,
    clearSelection,
  };
};
