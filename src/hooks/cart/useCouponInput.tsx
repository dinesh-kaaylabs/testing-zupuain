import { useState, useCallback, useMemo } from 'react';
import { UserCoupon } from '../../types/api';
import { CouponDiscountResult } from '../../utils/couponUtils';

interface UseCouponInputProps {
  availableCoupons: UserCoupon[];
  validCoupons: UserCoupon[];
  invalidCoupons: Array<{ coupon: UserCoupon; validation: { message?: string } }>;
  appliedCoupon: UserCoupon | null;
  appliedDiscount: CouponDiscountResult | null;
  bestCoupon: { coupon: UserCoupon | null; savings: number };
  onApplyCoupon: (couponCode: string) => Promise<boolean>;
  onApplyCouponDirect: (coupon: UserCoupon) => Promise<boolean>;
  onRemoveCoupon: () => void;
  onApplyBestCoupon: () => void;
  isLoading?: boolean;
  cartTotal: number;
}

export const useCouponInput = ({
  validCoupons, invalidCoupons, onApplyCoupon, onApplyCouponDirect, onRemoveCoupon, cartTotal,
}: UseCouponInputProps) => {
  const [couponCode, setCouponCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [showAllCoupons, setShowAllCoupons] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const handleApplyCoupon = useCallback(async () => {
    if (!couponCode.trim()) return setError('Please enter a coupon code');
    setIsApplying(true);
    setError(null);
    try {
      const success = await onApplyCoupon(couponCode.trim().toUpperCase());
      if (success) setCouponCode('');
      else setError('Invalid or expired coupon code');
    } catch {
      setError('Failed to apply coupon');
    } finally {
      setIsApplying(false);
    }
  }, [couponCode, onApplyCoupon]);
  const handleRemoveCoupon = useCallback(() => {
    onRemoveCoupon();
    setError(null);
  }, [onRemoveCoupon]);
  const handleSelectCoupon = useCallback(async (coupon: UserCoupon) => {
    setCouponCode(coupon.coupon_code);
    setIsApplying(true);
    setError(null);
    try {
      if (!await onApplyCouponDirect(coupon)) setError('Failed to apply coupon');
    } catch {
      setError('Failed to apply coupon');
    } finally {
      setIsApplying(false);
    }
  }, [onApplyCouponDirect]);
  const filteredValidCoupons = useMemo(() => {
    let filtered = validCoupons;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(c => 
        c.coupon_code.toLowerCase().includes(query) || c.description.toLowerCase().includes(query)
      );
    }
    if (filterType !== 'all') {
      filtered = filtered.filter(c => c.coupon_type === filterType);
    }
    return filtered;
  }, [validCoupons, searchQuery, filterType]);
  const handleCouponCodeChange = useCallback((value: string) => {
    setCouponCode(value.toUpperCase());
    setError(null);
  }, []);
  const handleSearchChange = useCallback((value: string) => setSearchQuery(value), []);
  const handleFilterTypeChange = useCallback((type: string) => setFilterType(type), []);
  const toggleShowAllCoupons = useCallback(() => setShowAllCoupons(p => !p), []);
  const toggleShowFilters = useCallback(() => setShowFilters(p => !p), []);
  const minAmountNeeded = useMemo(() => {
    if (!invalidCoupons.length) return 0;
    return Math.max(0, Math.max(...invalidCoupons.map(({ coupon }) => coupon.discount_offer)) - cartTotal);
  }, [invalidCoupons, cartTotal]);
  return {
    couponCode, error, isApplying, showAllCoupons, searchQuery, filterType, showFilters,
    filteredValidCoupons, minAmountNeeded, handleApplyCoupon, handleRemoveCoupon, 
    handleSelectCoupon, handleCouponCodeChange, handleSearchChange, handleFilterTypeChange, 
    toggleShowAllCoupons, toggleShowFilters,
  };
};
