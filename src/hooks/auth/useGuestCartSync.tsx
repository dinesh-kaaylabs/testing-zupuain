import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../redux';
import { syncGuestCart } from '../../store/slices/cartSlice';
import { useToast } from '../ui/useToast';

interface UseGuestCartSyncReturn {
  syncGuestCart: () => Promise<void>;
  hasGuestItems: boolean;
  guestItemCount: number;
}

export const useGuestCartSync = (): UseGuestCartSyncReturn => {
  const dispatch = useAppDispatch();
  const { success, error: errorToast } = useToast();
  const { guestItems, defaultStore } = useAppSelector((state) => ({
    guestItems: state.cart.guestItems,
    defaultStore: state.store.defaultStore,
  }));
  const hasGuestItems = guestItems.length > 0;
  const guestItemCount = guestItems.reduce((total, item) => total + item.product_count, 0);
  const syncGuestCartItems = useCallback(async () => {
    if (!hasGuestItems || !defaultStore?.store_uid) {
      errorToast('No items to sync or store not available');
      return;
    }
    try {
      const result = await dispatch(syncGuestCart({ guestItems, store_uid: defaultStore.store_uid }));
      if (syncGuestCart.fulfilled.match(result)) {
        success(`Synced ${guestItemCount} items from your guest cart!`);
      } else if (syncGuestCart.rejected.match(result)) {
        errorToast((result.payload as string) || 'Failed to sync guest cart');
      }
    } catch (err) {
      const error = err as Error;
      errorToast(error?.message || 'Failed to sync cart.');
    }
  }, [dispatch, guestItems, defaultStore?.store_uid, hasGuestItems, guestItemCount, success, errorToast]);
  return { syncGuestCart: syncGuestCartItems, hasGuestItems, guestItemCount };
};
