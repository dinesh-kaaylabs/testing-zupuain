import { useCallback } from 'react';
import { useAppDispatch } from '../redux/useAppDispatch';
import { addToCart, incrementQuantity, decrementQuantity, removeFromCart } from '../../store/slices/cartSlice';
import { Product } from '../../types/api';
import { ProductDisplayData, createCartItem } from '../../utils/productUtils';
import { useToast } from '../ui/useToast';

interface UseCartActionsReturn {
  handleAddToCart: (product: Product, displayData: ProductDisplayData, quantity?: number) => Promise<boolean>;
  handleIncrementQuantity: (uid: string, id?: number) => Promise<boolean>;
  handleDecrementQuantity: (uid: string, id?: number) => Promise<boolean>;
  handleRemoveFromCart: (uid: string, id?: number) => Promise<boolean>;
}

export const useCartActions = (): UseCartActionsReturn => {
  const dispatch = useAppDispatch();
  const { success, error } = useToast();
  const handleAddToCart = useCallback(async (product: Product, displayData: ProductDisplayData, quantity?: number) => {
    try {
      await dispatch(addToCart(createCartItem(product, displayData, quantity || displayData.minOrderQuantity))).unwrap();
      success('Product added to cart!');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add product to cart';
      error(errorMessage);
      return false;
    }
  }, [dispatch, success, error]);
  const handleAction = useCallback(async (
    action: typeof incrementQuantity | typeof decrementQuantity | typeof removeFromCart,
    productUid: string, bagDetailId?: number, msg?: string
  ) => {
    try {
      await dispatch(action({ product_uid: productUid, bag_detail_id: bagDetailId })).unwrap();
      if (msg) success(msg);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update cart';
      error(errorMessage);
      return false;
    }
  }, [dispatch, success, error]);
  const handleIncrementQuantity = useCallback((uid: string, id?: number) => 
    handleAction(incrementQuantity, uid, id), [handleAction]);
  const handleDecrementQuantity = useCallback((uid: string, id?: number) => 
    handleAction(decrementQuantity, uid, id), [handleAction]);
  const handleRemoveFromCart = useCallback((uid: string, id?: number) => 
    handleAction(removeFromCart, uid, id, 'Product removed from cart'), [handleAction]);
  return { handleAddToCart, handleIncrementQuantity, handleDecrementQuantity, handleRemoveFromCart };
};
