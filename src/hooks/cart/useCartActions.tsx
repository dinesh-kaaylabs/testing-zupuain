import { useCallback } from 'react';
import { useAppDispatch } from '../redux/useAppDispatch';
import { addToCart, incrementQuantity, decrementQuantity, removeFromCart } from '../../store/slices/cartSlice';
import { Product } from '../../types/api';
import { ProductDisplayData, createCartItem } from '../../utils/productUtils';
import { useToast } from '../ui/useToast';

export const useCartActions = () => {
  const dispatch = useAppDispatch();
  const { success, error } = useToast();
  const handleAddToCart = useCallback(async (product: Product, displayData: ProductDisplayData, quantity?: number) => {
    try {
      await dispatch(addToCart(createCartItem(product, displayData, quantity || displayData.minOrderQuantity))).unwrap();
      success('Product added to cart!');
      return true;
    } catch (err: any) {
      error(err?.message || 'Failed to add product to cart');
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
    } catch (err: any) {
      error(err?.message || 'Failed to update cart');
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
