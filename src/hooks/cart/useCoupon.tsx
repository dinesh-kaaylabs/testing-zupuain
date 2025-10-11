import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../redux';
import { fetchUserCoupons, setAppliedCoupon as setReduxAppliedCoupon, clearAppliedCoupon } from '../../store/slices/couponSlice';
import { useToast } from '../ui/useToast';
import { UserCoupon, CartItem, BagDetail } from '../../types/api';
import {
  validateCoupon,
  calculateCouponDiscount,
  selectBestCoupon,
  filterCoupons,
  sortCoupons,
  toUnifiedCartItem,
  CouponFilterOptions,
  CouponSortBy,
  CouponDiscountResult,
  UnifiedCartItem,
} from '../../utils/couponUtils';

interface UseCouponProps {
  isAuthenticated: boolean;
  userUid?: string;
  cartTotal: number;
  deliveryCharge: number;
  cartItems: (CartItem | BagDetail)[];
  isOnlinePayment?: boolean;
}

export const useCoupon = ({
  isAuthenticated,
  userUid,
  cartTotal,
  deliveryCharge,
  cartItems,
  isOnlinePayment = false,
}: UseCouponProps) => {
  const dispatch = useAppDispatch();
  const { success, error: showError } = useToast();

  // Redux state
  const { availableCoupons, loading: couponsLoading, appliedCoupon } = useAppSelector((state) => state.coupon);

  // Local state
  const [appliedDiscount, setAppliedDiscount] = useState<CouponDiscountResult | null>(null);
  const [filterOptions, setFilterOptions] = useState<CouponFilterOptions>({});
  const [sortBy, setSortBy] = useState<CouponSortBy>('discount_desc');
  const [autoApplyBest, setAutoApplyBest] = useState(false);

  // Convert cart items to unified format
  const unifiedCartItems = useMemo(() => cartItems.map(toUnifiedCartItem), [cartItems]);

  // Stable reference for cart items to prevent infinite loops
  const cartItemsKey = useMemo(() => 
    JSON.stringify(cartItems.map(item => ({
      uid: 'bag_detail_id' in item ? item.product_uid : item.product_uid,
      count: item.product_count,
      price: 'bag_detail_id' in item ? item.selling_price : item.price
    })))
  , [cartItems]);

  // Fetch coupons
  useEffect(() => {
    dispatch(fetchUserCoupons());
  }, [dispatch]);

  // Calculate and validate discount
  useEffect(() => {
    if (!appliedCoupon) {
      if (appliedDiscount) setAppliedDiscount(null);
      return;
    }

    const discount = calculateCouponDiscount(appliedCoupon, cartTotal, deliveryCharge, unifiedCartItems);
    
    if (cartTotal > 0) {
      const validation = validateCoupon(appliedCoupon, cartTotal, unifiedCartItems, isOnlinePayment);
      if (!validation.isValid) {
        dispatch(clearAppliedCoupon());
        setAppliedDiscount(null);
        showError(validation.message || 'Applied coupon is no longer valid');
      } else {
        setAppliedDiscount(discount);
      }
    } else {
      setAppliedDiscount(discount);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appliedCoupon, cartTotal, deliveryCharge, cartItemsKey, isOnlinePayment, dispatch, showError]);

  // Filter and sort coupons
  const processedCoupons = useMemo(() => {
    let processed = filterCoupons(availableCoupons, filterOptions);
    processed = sortCoupons(processed, sortBy, cartTotal, deliveryCharge, unifiedCartItems);
    return processed;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availableCoupons, filterOptions, sortBy, cartTotal, deliveryCharge, cartItemsKey]);

  // Valid coupons (that pass validation)
  const validCoupons = useMemo(() => {
    return processedCoupons.filter(coupon => {
      const validation = validateCoupon(coupon, cartTotal, unifiedCartItems, isOnlinePayment);
      return validation.isValid;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [processedCoupons, cartTotal, cartItemsKey, isOnlinePayment]);

  // Invalid coupons with reasons
  const invalidCoupons = useMemo(() => {
    return processedCoupons
      .map(coupon => {
        const validation = validateCoupon(coupon, cartTotal, unifiedCartItems, isOnlinePayment);
        if (!validation.isValid) {
          return { coupon, validation };
        }
        return null;
      })
      .filter(Boolean) as Array<{ coupon: UserCoupon; validation: ReturnType<typeof validateCoupon> }>;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [processedCoupons, cartTotal, cartItemsKey, isOnlinePayment]);

  // Best coupon suggestion
  const bestCoupon = useMemo(() => {
    return selectBestCoupon(
      availableCoupons,
      cartTotal,
      deliveryCharge,
      unifiedCartItems,
      isOnlinePayment
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availableCoupons, cartTotal, deliveryCharge, cartItemsKey, isOnlinePayment]);

  // Track if we've already auto-applied to prevent re-application
  const hasAutoAppliedRef = useRef(false);

  // Auto-apply best coupon if enabled
  useEffect(() => {
    if (autoApplyBest && bestCoupon.coupon && bestCoupon.discount && !appliedCoupon && !hasAutoAppliedRef.current) {
      hasAutoAppliedRef.current = true;
      dispatch(setReduxAppliedCoupon({ 
        coupon: bestCoupon.coupon, 
        discount: bestCoupon.discount.discountAmount 
      }));
      setAppliedDiscount(bestCoupon.discount);
      success(`Best coupon ${bestCoupon.coupon.coupon_code} applied automatically!`);
    }
    
    // Reset flag when coupon is removed or auto-apply is disabled
    if (!autoApplyBest || appliedCoupon) {
      hasAutoAppliedRef.current = false;
    }
  }, [autoApplyBest, bestCoupon, appliedCoupon, success, dispatch]);

  // Calculate discount for specific coupon (preview)
  const previewDiscount = useCallback(
    (coupon: UserCoupon): CouponDiscountResult | null => {
      const validation = validateCoupon(coupon, cartTotal, unifiedCartItems, isOnlinePayment);
      if (!validation.isValid) return null;

      return calculateCouponDiscount(coupon, cartTotal, deliveryCharge, unifiedCartItems);
    },
    [cartTotal, deliveryCharge, unifiedCartItems, isOnlinePayment]
  );

  // Coupon application logic
  const applyCouponLogic = useCallback((coupon: UserCoupon) => {
    const validation = validateCoupon(coupon, cartTotal, unifiedCartItems, isOnlinePayment);
    if (!validation.isValid) {
      showError(validation.message || 'Invalid coupon');
      return false;
    }

    const discount = calculateCouponDiscount(coupon, cartTotal, deliveryCharge, unifiedCartItems);
    dispatch(setReduxAppliedCoupon({ coupon, discount: discount.discountAmount }));
    setAppliedDiscount(discount);
    
    success(coupon.coupon_type === 'free-shipping'
      ? `${coupon.coupon_code} applied! Free shipping activated.`
      : `${coupon.coupon_code} applied! You save ₹${discount.discountAmount.toFixed(2)}`);
    return true;
  }, [cartTotal, deliveryCharge, unifiedCartItems, isOnlinePayment, success, showError, dispatch]);

  // Handle coupon application by code
  const handleApplyCoupon = useCallback(
    async (couponCode: string): Promise<boolean> => {
      if (!couponCode?.trim()) {
        showError('Please enter a coupon code');
        return false;
      }

      const coupon = availableCoupons.find(c => c.coupon_code.toUpperCase() === couponCode.toUpperCase());
      if (!coupon) {
        showError('Invalid coupon code');
        return false;
      }

      if (appliedCoupon?.coupon_uid === coupon.coupon_uid) {
        showError('This coupon is already applied');
        return false;
      }

      return applyCouponLogic(coupon);
    },
    [availableCoupons, appliedCoupon, showError, applyCouponLogic]
  );

  // Handle coupon application by object
  const handleApplyCouponDirect = useCallback(
    async (coupon: UserCoupon): Promise<boolean> => {
      if (appliedCoupon?.coupon_uid === coupon.coupon_uid) {
        showError('This coupon is already applied');
        return false;
      }
      return applyCouponLogic(coupon);
    },
    [appliedCoupon, showError, applyCouponLogic]
  );

  // Handle coupon removal
  const handleRemoveCoupon = useCallback(() => {
    dispatch(clearAppliedCoupon());
    setAppliedDiscount(null);
    success(appliedCoupon?.coupon_type === 'free-shipping'
      ? 'Coupon removed. Delivery charge restored.'
      : 'Coupon removed');
  }, [appliedCoupon, success, dispatch]);

  // Apply best coupon
  const applyBestCoupon = useCallback(() => {
    bestCoupon.coupon ? handleApplyCouponDirect(bestCoupon.coupon) : showError('No valid coupons available');
  }, [bestCoupon, handleApplyCouponDirect, showError]);

  // Filter and refresh actions
  const updateFilters = useCallback((options: Partial<CouponFilterOptions>) => 
    setFilterOptions(prev => ({ ...prev, ...options })), []);
  const clearFilters = useCallback(() => setFilterOptions({}), []);
  const refreshCoupons = useCallback(() => dispatch(fetchUserCoupons()), [dispatch]);

  // Get coupon statistics
  const couponStats = useMemo(() => ({
    total: availableCoupons.length,
    valid: validCoupons.length,
    invalid: invalidCoupons.length,
    bestSavings: bestCoupon.savings,
    appliedSavings: appliedDiscount?.discountAmount || 0,
  }), [availableCoupons, validCoupons, invalidCoupons, bestCoupon, appliedDiscount]);

  // Consolidated return object
  return {
    // State
    appliedCoupon, appliedDiscount, availableCoupons: processedCoupons,
    validCoupons, invalidCoupons, bestCoupon, couponsLoading, couponStats, autoApplyBest,

    // Filters & Sorting
    filterOptions, sortBy, updateFilters, clearFilters, setSortBy, setAutoApplyBest,

    // Functions
    handleApplyCoupon, handleApplyCouponDirect, handleRemoveCoupon,
    applyBestCoupon, previewDiscount, refreshCoupons,

    // Utilities
    validateCoupon: (coupon: UserCoupon) => validateCoupon(coupon, cartTotal, unifiedCartItems, isOnlinePayment),
    calculateDiscount: (coupon: UserCoupon) => calculateCouponDiscount(coupon, cartTotal, deliveryCharge, unifiedCartItems),
  };
};
