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
import { UserCoupon, CartItem, BagDetail, DeliveryCharge } from '../../types/api';
import { CouponDiscountResult, CouponFilterOptions, CouponSortBy } from '../../utils/couponUtils';

interface PricingInfo {
  subtotal: number;
  deliveryCharge: number;
  baseDeliveryCharge: number;
  deliveryDiscount: number;
  productDiscount: number;
  discount: number;
  tax: number;
  codCharge: number;
  total: number;
  couponApplied: boolean;
  isFreeDelivery: boolean;
}

interface PricingSummaryInfo {
  subtotal: string;
  deliveryCharge: string;
  baseDeliveryCharge: string;
  deliveryDiscount: string;
  productDiscount: string;
  discount: string;
  tax: string;
  codCharge: string;
  total: string;
  savings: string;
}

interface DeliveryChargeInfo {
  baseCharge: number;
  finalCharge: number;
  saved: number;
  isFree: boolean;
  hasDiscount: boolean;
}

interface CouponStats {
  total: number;
  valid: number;
  invalid: number;
  bestSavings: number;
  appliedSavings: number;
}

interface BestCouponInfo {
  coupon: UserCoupon | null;
  savings: number;
  discount: CouponDiscountResult | null;
}

interface InvalidCouponInfo {
  coupon: UserCoupon;
  validation: {
    isValid: boolean;
    message?: string;
    reason?: string;
  };
}

interface UseCartReturn {
  // Cart state
  cartItems: (CartItem | BagDetail)[];
  isGuest: boolean;
  loading: boolean;
  error: string | null;
  totalItems: number;
  isUpdating: boolean;
  hasInitialized: boolean;
  
  // Pricing
  pricing: PricingInfo;
  pricingSummary: PricingSummaryInfo;
  totalSavings: number;
  potentialSavings: number;
  discountBreakdown: Array<{ label: string; amount: number }>;
  deliveryChargeInfo: DeliveryChargeInfo;
  deliveryCharge: DeliveryCharge | null;
  deliveryChargeLoading: boolean;
  isFreeDeliveryEligible: boolean;
  
  // Coupons
  appliedCoupon: UserCoupon | null;
  appliedDiscount: CouponDiscountResult | null;
  availableCoupons: UserCoupon[];
  validCoupons: UserCoupon[];
  invalidCoupons: InvalidCouponInfo[];
  bestCoupon: BestCouponInfo;
  couponsLoading: boolean;
  couponStats: CouponStats;
  
  // Cart actions
  handleIncrement: (uid: string, productVariantId?: string) => void;
  handleDecrement: (uid: string, productVariantId?: string) => void;
  handleRemove: (uid: string, productVariantId?: string) => void;
  handleMoveToWishlist: (uid: string) => Promise<void>;
  handleCheckout: () => void;
  
  // Coupon actions
  handleApplyCoupon: (code: string) => Promise<boolean>;
  handleApplyCouponDirect: (coupon: UserCoupon) => Promise<boolean>;
  handleRemoveCoupon: () => void;
  applyBestCoupon: () => void;
  previewDiscount: (coupon: UserCoupon) => CouponDiscountResult | null;
  refreshCoupons: () => void;
  updateFilters: (options: Partial<CouponFilterOptions>) => void;
  clearFilters: () => void;
  setSortBy: (sortBy: CouponSortBy) => void;
  
  // UI State
  showCouponList: boolean;
  handleToggleCouponList: (show: boolean) => void;
  handleSelectCoupon: (coupon: UserCoupon) => Promise<void>;
  
  // Utilities
  filterOptions: CouponFilterOptions;
  sortBy: CouponSortBy;
  formatCurrency: (amount: number) => string;
  refreshDeliveryCharge: () => void;
}

export const useCart = (): UseCartReturn => {
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
  const [showCouponList, setShowCouponList] = useState(false);

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
    productUid: string, productVariantId?: string, successMsg?: string
  ) => {
    if (!defaultStore?.store_uid) return;
    setIsUpdating(true);
    try {
      await dispatch(action({
        product_uid: productUid, product_variant_id: productVariantId,
        slug: 'CART', store_uid: defaultStore.store_uid,
      })).unwrap();
      if (!isGuest) await dispatch(fetchBag(defaultStore.store_uid)).unwrap();
      if (successMsg) success(successMsg);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : (typeof err === 'string' ? err : 'Failed to update cart');
      showError(errorMessage);
    } finally {
      setIsUpdating(false);
    }
  }, [dispatch, defaultStore, isGuest, success, showError]);
  const handleIncrement = useCallback((uid: string, productVariantId?: string) => 
    handleCartAction(incrementQuantity, uid, productVariantId), [handleCartAction]);

  const handleDecrement = useCallback((uid: string, productVariantId?: string) => 
    handleCartAction(decrementQuantity, uid, productVariantId), [handleCartAction]);

  const handleRemove = useCallback((uid: string, productVariantId?: string) => 
    handleCartAction(removeFromCart, uid, productVariantId, 'Item removed from cart'), [handleCartAction]);
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
      await handleRemove(uid, 'product_variant_id' in cartItem ? String(cartItem.product_variant_id) : undefined);
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

  // Handle coupon list toggle
  const handleToggleCouponList = useCallback((show: boolean) => {
    setShowCouponList(show);
  }, []);

  // Handle coupon selection with wrapper
  const handleSelectCoupon = useCallback(async (coupon: UserCoupon): Promise<void> => {
    const success = await handleApplyCouponDirect(coupon);
    if (success) {
      setShowCouponList(false);
    }
  }, [handleApplyCouponDirect]);

  return {
    cartItems, isGuest, loading, error, totalItems, isUpdating, hasInitialized,
    pricing, pricingSummary, totalSavings, potentialSavings, discountBreakdown,
    deliveryChargeInfo, deliveryCharge, deliveryChargeLoading, isFreeDeliveryEligible,
    appliedCoupon, appliedDiscount, availableCoupons, validCoupons, invalidCoupons,
    bestCoupon, couponsLoading, couponStats,
    handleIncrement, handleDecrement, handleRemove, handleMoveToWishlist, handleCheckout,
    handleApplyCoupon, handleApplyCouponDirect, handleRemoveCoupon, applyBestCoupon,
    previewDiscount, refreshCoupons, updateFilters, clearFilters, setSortBy,
    showCouponList, handleToggleCouponList, handleSelectCoupon,
    filterOptions, sortBy, formatCurrency, refreshDeliveryCharge,
  };
};
