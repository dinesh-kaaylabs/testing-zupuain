import { useCallback } from 'react';
import { useCartActions, useWishlistActions } from '../index';
import { useToast } from '../ui/useToast';
import type { Product } from '../../types/api';
import type { ProductDisplayData } from '../../utils/productUtils';

interface UseWishlistBulkActionsProps {
  selectedItems: Set<string>;
  products: Product[];
  displayDataMap: Map<string, ProductDisplayData>;
  clearSelection: () => void;
}

export const useWishlistBulkActions = ({
  selectedItems,
  products,
  displayDataMap,
  clearSelection,
}: UseWishlistBulkActionsProps) => {
  const { handleAddToCart } = useCartActions();
  const { handleRemoveFromWishlist } = useWishlistActions();
  const { success } = useToast();

  const handleRemoveSelected = useCallback(async () => {
    if (selectedItems.size === 0) return;

    const confirmRemove = window.confirm(
      `Are you sure you want to remove ${selectedItems.size} item(s) from your wishlist?`
    );

    if (!confirmRemove) return;

    const promises = Array.from(selectedItems).map((uid) =>
      handleRemoveFromWishlist(uid)
    );

    await Promise.all(promises);
    clearSelection();
    success(`Removed ${selectedItems.size} item(s) from wishlist`);
  }, [selectedItems, handleRemoveFromWishlist, clearSelection, success]);

  const handleMoveSelectedToCart = useCallback(async () => {
    if (selectedItems.size === 0) return;

    let successCount = 0;
    const selectedProducts = products.filter((p) =>
      selectedItems.has(p.product_uid)
    );

    for (const product of selectedProducts) {
      const displayData = displayDataMap.get(product.product_uid);
      if (!displayData) continue;

      if (!displayData.isAvailable) {
        continue; // Skip out of stock items
      }

      const addSuccess = await handleAddToCart(product, displayData, 1);
      if (addSuccess) {
        await handleRemoveFromWishlist(product.product_uid);
        successCount++;
      }
    }

    clearSelection();
    
    if (successCount > 0) {
      success(`Moved ${successCount} item(s) to cart`);
    }
  }, [
    selectedItems,
    products,
    displayDataMap,
    handleAddToCart,
    handleRemoveFromWishlist,
    clearSelection,
    success,
  ]);

  return {
    handleRemoveSelected,
    handleMoveSelectedToCart,
  };
};
