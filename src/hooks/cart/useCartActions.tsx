import { useCallback } from 'react';
import { useAppDispatch } from '../redux/useAppDispatch';
import { addToCart, incrementQuantity, decrementQuantity, removeFromCart } from '../../store/slices/cartSlice';
import { Product } from '../../types/api';
import { ProductDisplayData, createCartItem, getDefaultVariantId } from '../../utils/productUtils';
import { useToast } from '../ui/useToast';

interface UseCartActionsReturn {
  handleAddToCart: (product: Product, displayData: ProductDisplayData, quantity?: number, variantId?: string | null) => Promise<boolean>;
  handleIncrementQuantity: (uid: string, id?: number) => Promise<boolean>;
  handleDecrementQuantity: (uid: string, id?: number) => Promise<boolean>;
  handleRemoveFromCart: (uid: string, id?: number) => Promise<boolean>;
}

export const useCartActions = (): UseCartActionsReturn => {
  const dispatch = useAppDispatch();
  const { success, error } = useToast();
  
  const handleAddToCart = useCallback(async (product: Product, displayData: ProductDisplayData, qty?: number, variantId?: string | null) => {
    try {
      const vId = variantId !== undefined ? variantId : getDefaultVariantId(product);
    
      await dispatch(addToCart(createCartItem(product, displayData, qty || displayData.minOrderQuantity, vId))).unwrap();
      success('Product added to cart!');
      return true;
    } catch (err) {
      error(err instanceof Error ? err.message : 'Failed to add product to cart');
      return false;
    }
  }, [dispatch, success, error]);

  const handleAction = useCallback(async (
    action: typeof incrementQuantity | typeof decrementQuantity | typeof removeFromCart,
    uid: string, id?: number, msg?: string
  ) => {
    try {
      await dispatch(action({ product_uid: uid, bag_detail_id: id })).unwrap();
      if (msg) success(msg);
      return true;
    } catch (err) {
      error(err instanceof Error ? err.message : 'Failed to update cart');
      return false;
    }
  }, [dispatch, success, error]);

  return {
    handleAddToCart,
    handleIncrementQuantity: useCallback((uid: string, id?: number) => handleAction(incrementQuantity, uid, id), [handleAction]),
    handleDecrementQuantity: useCallback((uid: string, id?: number) => handleAction(decrementQuantity, uid, id), [handleAction]),
    handleRemoveFromCart: useCallback((uid: string, id?: number) => handleAction(removeFromCart, uid, id, 'Product removed from cart'), [handleAction]),
  };
};
