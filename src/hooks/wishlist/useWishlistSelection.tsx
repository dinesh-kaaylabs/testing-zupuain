import { useState, useEffect, useCallback } from 'react';
import type { Product } from '../../types/api';

interface UseWishlistSelectionProps {
  products: Product[];
}

export const useWishlistSelection = ({ products }: UseWishlistSelectionProps) => {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  // Clear selections when products change
  useEffect(() => {
    setSelectedItems(new Set());
  }, [products.length]);

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
    setSelectedItems(new Set(products.map((p) => p.product_uid)));
  }, [products]);

  const handleDeselectAll = useCallback(() => {
    setSelectedItems(new Set());
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedItems(new Set());
  }, []);

  return {
    selectedItems,
    selectedCount: selectedItems.size,
    handleToggleSelect,
    handleSelectAll,
    handleDeselectAll,
    clearSelection,
  };
};
