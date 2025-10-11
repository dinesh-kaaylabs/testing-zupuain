import { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux';
import { 
  fetchBag, 
  incrementQuantity, 
  decrementQuantity, 
  removeFromCart, 
  syncGuestCart 
} from '../../store/slices/cartSlice';
import { addToWishlist } from '../../store/slices/wishlistSlice';
import { useToast } from '../ui/useToast';
import { useCoupon } from './useCoupon';
import { usePricing } from './usePricing';
import { useDerivedCartItems } from '../../utils/cartDataHelpers';

export const useCart = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { success, error: showError } = useToast();

  const { 
    bags, guestItems, loading, error, totalAmount,
    isAuthenticated, user, defaultStore, baseDeliveryCharge 
  } = useAppSelector((state) => ({
    bags: state.cart.bags,
    guestItems: state.cart.guestItems,
    loading: state.cart.loading,
    error: state.cart.error,
    totalAmount: state.cart.totalAmount,
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user,
    defaultStore: state.store.defaultStore,
    baseDeliveryCharge: state.deliveryCharge.deliveryCharge?.delivery_charge || 0,
  }));

  const [isUpdating, setIsUpdating] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  const isGuest = !isAuthenticated;
  const cartItems = useDerivedCartItems(isGuest, guestItems, bags);
  const totalItems = cartItems.reduce((sum, item) => sum + item.product_count, 0);
  const couponConfig = useMemo(() => ({
    isAuthenticated,
    userUid: user?.user_uid,
    cartTotal: totalAmount,
    deliveryCharge: baseDeliveryCharge,
    cartItems,
    isOnlinePayment: false,
  }), [isAuthenticated, user?.user_uid, totalAmount, baseDeliveryCharge, cartItems]);

  const {
    appliedCoupon,
    appliedDiscount,
    availableCoupons,
    validCoupons,
    invalidCoupons,
    bestCoupon,
    couponsLoading,
    couponStats,
    handleApplyCoupon,
    handleApplyCouponDirect,
    handleRemoveCoupon,
    applyBestCoupon,
    previewDiscount,
    refreshCoupons,
    updateFilters,
    clearFilters,
    setSortBy,
    filterOptions,
    sortBy,
  } = useCoupon(couponConfig);

  // Pricing hook with memoized config
  const pricingConfig = useMemo(() => ({
    subtotal: totalAmount,
    appliedCoupon,
    appliedDiscount,
    storeUid: defaultStore?.store_uid,
  }), [totalAmount, appliedCoupon, appliedDiscount, defaultStore?.store_uid]);

  const {
    pricing,
    pricingSummary,
    totalSavings,
    potentialSavings,
    discountBreakdown,
    deliveryChargeInfo,
    deliveryCharge,
    deliveryChargeLoading,
    isFreeDeliveryEligible,
    formatCurrency,
    refreshDeliveryCharge,
  } = usePricing(pricingConfig);

  useEffect(() => {
    if (defaultStore?.store_uid) {
      dispatch(fetchBag(defaultStore.store_uid)).finally(() => {
        setHasInitialized(true);
      });
    } else {
      setHasInitialized(true);
    }
  }, [dispatch, defaultStore?.store_uid]);
  useEffect(() => {
    const syncCart = async () => {
      if (isAuthenticated && guestItems.length > 0 && defaultStore?.store_uid) {
        try {
          await dispatch(syncGuestCart({ guestItems, store_uid: defaultStore.store_uid })).unwrap();
          await dispatch(fetchBag(defaultStore.store_uid)).unwrap();
          success('Guest cart synced successfully!');
        } catch (err) {
          showError('Failed to sync guest cart');
        }
      }
    };
    syncCart();
  }, [isAuthenticated, guestItems.length, defaultStore, dispatch, success, showError]);
  const handleCartAction = useCallback(async (
    action: typeof incrementQuantity | typeof decrementQuantity | typeof removeFromCart,
    productUid: string, bagDetailId?: number, successMsg?: string
  ) => {
    if (!defaultStore?.store_uid) return;
    setIsUpdating(true);
    try {
      await dispatch(action({
        product_uid: productUid, bag_detail_id: bagDetailId,
        slug: 'CART', store_uid: defaultStore.store_uid,
      })).unwrap();
      if (!isGuest) await dispatch(fetchBag(defaultStore.store_uid)).unwrap();
      if (successMsg) success(successMsg);
    } catch (err: any) {
      showError(err || 'Failed to update cart');
    } finally {
      setIsUpdating(false);
    }
  }, [dispatch, defaultStore, isGuest, success, showError]);
  const handleIncrement = useCallback((uid: string, id?: number) => 
    handleCartAction(incrementQuantity, uid, id), [handleCartAction]);

  const handleDecrement = useCallback((uid: string, id?: number) => 
    handleCartAction(decrementQuantity, uid, id), [handleCartAction]);

  const handleRemove = useCallback((uid: string, id?: number) => 
    handleCartAction(removeFromCart, uid, id, 'Item removed from cart'), [handleCartAction]);
  const handleMoveToWishlist = useCallback(async (uid: string): Promise<void> => {
    if (!defaultStore?.store_uid || isGuest) {
      showError('Unable to move item to wishlist');
      return;
    }
    const cartItem = cartItems.find(item => item.product_uid === uid);
    if (!cartItem) {
      showError('Product not found in cart');
      return;
    }
    const product = 'zm_products' in cartItem ? cartItem.zm_products?.[0] : null;
    if (!product) {
      showError('Product details not found');
      return;
    }
    try {
      await dispatch(addToWishlist(product)).unwrap();
      await handleRemove(uid, 'bag_detail_id' in cartItem ? cartItem.bag_detail_id : undefined);
      success('Item moved to wishlist!');
    } catch {
      showError('Failed to move item to wishlist');
    }
  }, [cartItems, dispatch, handleRemove, isGuest, defaultStore, success, showError]);
  const handleCheckout = useCallback(() => {
    if (!cartItems.length) return showError('Your cart is empty');
    if (isGuest) return navigate('/login?redirect=/checkout');
    navigate('/checkout', { state: { appliedCoupon, pricing } });
  }, [cartItems.length, isGuest, navigate, appliedCoupon, pricing, showError]);

  return {
    cartItems, isGuest, loading, error, totalItems, isUpdating, hasInitialized,
    pricing, pricingSummary, totalSavings, potentialSavings, discountBreakdown,
    deliveryChargeInfo, deliveryCharge, deliveryChargeLoading, isFreeDeliveryEligible,
    appliedCoupon, appliedDiscount, availableCoupons, validCoupons, invalidCoupons,
    bestCoupon, couponsLoading, couponStats,
    handleIncrement, handleDecrement, handleRemove, handleMoveToWishlist, handleCheckout,
    handleApplyCoupon, handleApplyCouponDirect, handleRemoveCoupon, applyBestCoupon,
    previewDiscount, refreshCoupons, updateFilters, clearFilters, setSortBy,
    filterOptions, sortBy, formatCurrency, refreshDeliveryCharge,
  };
};
