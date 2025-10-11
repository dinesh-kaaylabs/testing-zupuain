import { useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../redux';
import { addToWishlist, removeFromWishlist } from '../../store/slices/wishlistSlice';
import { Product } from '../../types/api';
import { useToast } from '../ui/useToast';

interface UseWishlistActionsReturn {
  wishlistItems: Product[];
  wishlistProductUids: string[];
  isInWishlist: (uid: string) => boolean;
  handleAddToWishlist: (product: Product) => Promise<boolean>;
  handleRemoveFromWishlist: (uid: string) => Promise<boolean>;
  handleToggleWishlist: (product: Product) => Promise<boolean>;
}

export const useWishlistActions = (): UseWishlistActionsReturn => {
  const dispatch = useAppDispatch();
  const { success, error } = useToast();
  const { wishlistItems } = useAppSelector((state) => state.wishlist);
  const wishlistProductUids = useMemo(() => 
    new Set(wishlistItems.map(item => item.product_uid)), [wishlistItems]);
  const isInWishlist = useCallback((uid: string) => 
    wishlistProductUids.has(uid), [wishlistProductUids]);
  const handleAddToWishlist = useCallback(async (product: Product) => {
    try {
      await dispatch(addToWishlist(product)).unwrap();
      success('Added to wishlist!');
      return true;
    } catch {
      error('Failed to add to wishlist');
      return false;
    }
  }, [dispatch, success, error]);
  const handleRemoveFromWishlist = useCallback(async (uid: string) => {
    try {
      await dispatch(removeFromWishlist(uid)).unwrap();
      success('Removed from wishlist');
      return true;
    } catch {
      error('Failed to remove from wishlist');
      return false;
    }
  }, [dispatch, success, error]);
  const handleToggleWishlist = useCallback(async (product: Product) => 
    wishlistProductUids.has(product.product_uid)
      ? handleRemoveFromWishlist(product.product_uid)
      : handleAddToWishlist(product),
    [wishlistProductUids, handleAddToWishlist, handleRemoveFromWishlist]
  );
  return {
    wishlistItems, wishlistProductUids: Array.from(wishlistProductUids), isInWishlist,
    handleAddToWishlist, handleRemoveFromWishlist, handleToggleWishlist,
  };
};
