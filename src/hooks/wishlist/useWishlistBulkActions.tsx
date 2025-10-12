import { useCallback } from 'react';
import { useCartActions } from '../cart/useCartActions';
import { useWishlistActions } from './useWishlistActions';
import { useToast } from '../ui/useToast';
import type { Product } from '../../types/api';
import type { ProductDisplayData } from '../../utils/productUtils';

interface UseWishlistBulkActionsParams {
  selectedItems: Set<string>;
  products: Product[];
  displayDataMap: Map<string, ProductDisplayData>;
  clearSelection: () => void;
}

interface UseWishlistBulkActionsReturn {
  handleRemoveSelected: () => Promise<void>;
  handleMoveSelectedToCart: () => Promise<void>;
}

export const useWishlistBulkActions = ({
  selectedItems,
  products,
  displayDataMap,
  clearSelection,
}: UseWishlistBulkActionsParams): UseWishlistBulkActionsReturn => {
  const { handleAddToCart } = useCartActions();
  const { handleRemoveFromWishlist } = useWishlistActions();
  const { success, error: errorToast, warning } = useToast();

  const handleRemoveSelected = useCallback(async () => {
    if (selectedItems.size === 0) {
      warning('No items selected');
      return;
    }

    // Show confirmation dialog
    const confirmed = window.confirm(
      `Are you sure you want to remove ${selectedItems.size} item${
        selectedItems.size > 1 ? 's' : ''
      } from your wishlist?`
    );

    if (!confirmed) return;

    try {
      const removePromises = Array.from(selectedItems).map((productUid) =>
        handleRemoveFromWishlist(productUid)
      );

      await Promise.all(removePromises);

      success(
        `${selectedItems.size} item${
          selectedItems.size > 1 ? 's' : ''
        } removed from wishlist`
      );
      clearSelection();
    } catch (err) {
      console.error('Failed to remove selected items:', err);
      errorToast('Failed to remove some items. Please try again.');
    }
  }, [
    selectedItems,
    handleRemoveFromWishlist,
    clearSelection,
    success,
    errorToast,
    warning,
  ]);

  const handleMoveSelectedToCart = useCallback(async () => {
    if (selectedItems.size === 0) {
      warning('No items selected');
      return;
    }

    try {
      let movedCount = 0;
      let skippedCount = 0;

      for (const productUid of selectedItems) {
        const product = products.find((p) => p.product_uid === productUid);
        const displayData = displayDataMap.get(productUid);

        if (!product || !displayData) continue;

        // Skip out-of-stock items
        if (!displayData.isAvailable) {
          skippedCount++;
          continue;
        }

        // Add to cart with quantity 1
        const cartSuccess = await handleAddToCart(product, displayData, 1);
        if (cartSuccess) {
          // Remove from wishlist after successful cart addition
          await handleRemoveFromWishlist(productUid);
          movedCount++;
        }
      }

      if (movedCount > 0) {
        success(
          `${movedCount} item${movedCount > 1 ? 's' : ''} moved to cart`
        );
      }

      if (skippedCount > 0) {
        warning(
          `${skippedCount} out-of-stock item${
            skippedCount > 1 ? 's' : ''
          } skipped`
        );
      }

      clearSelection();
    } catch (err) {
      console.error('Failed to move selected items to cart:', err);
      errorToast('Failed to move some items to cart. Please try again.');
    }
  }, [
    selectedItems,
    products,
    displayDataMap,
    handleAddToCart,
    handleRemoveFromWishlist,
    clearSelection,
    success,
    errorToast,
    warning,
  ]);

  return {
    handleRemoveSelected,
    handleMoveSelectedToCart,
  };
};
