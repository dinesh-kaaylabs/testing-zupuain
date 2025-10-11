import { Coupon, CartItem, BagDetail } from '../types/api';

export interface CouponValidationResult {
  isValid: boolean;
  message?: string;
  reason?: 'expired' | 'not_started' | 'inactive' | 'usage_limit' | 'min_order' | 'no_eligible_items' | 'payment_restriction';
}

export interface CouponDiscountResult {
  discountAmount: number;
  deliveryDiscount: number;
  productDiscounts: Map<string, number>;
  categoryDiscounts: Map<string, number>;
  couponType: string;
}

export interface UnifiedCartItem {
  product_uid: string;
  product_count: number;
  price: number;
  category_uid: string;
}

export const toUnifiedCartItem = (item: CartItem | BagDetail): UnifiedCartItem => {
  if ('bag_detail_id' in item) {
    return {
      product_uid: item.product_uid,
      product_count: item.product_count,
      price: item.selling_price,
      category_uid: item.zm_products?.[0]?.category_uid || '',
    };
  }
  return {
    product_uid: item.product_uid,
    product_count: item.product_count,
    price: parseFloat(item.price),
    category_uid: item.category_uid,
  };
};

export const checkCouponConditions = (
  coupon: Coupon,
  cartTotal: number,
  cartItems: UnifiedCartItem[],
  currentAppliedCoupon: Coupon | null = null
): { canApply: boolean; conditions: Array<{ met: boolean; message: string; type: string }> } => {
  const conditions: Array<{ met: boolean; message: string; type: string }> = [];
  const isAlreadyApplied = currentAppliedCoupon?.coupon_uid === coupon.coupon_uid;
  
  conditions.push({
    met: !isAlreadyApplied,
    message: isAlreadyApplied ? 'This coupon is already applied' : 'Coupon not yet applied',
    type: 'already_applied',
  });
  conditions.push({
    met: coupon.is_active,
    message: coupon.is_active ? 'Coupon is active' : 'This coupon is not active',
    type: 'active',
  });
  const now = new Date();
  const startDate = new Date(coupon.start_date);
  const expiryDate = new Date(coupon.expiry_date);
  const isDateValid = now >= startDate && now <= expiryDate;
  conditions.push({
    met: isDateValid,
    message: now < startDate ? `Valid from ${startDate.toLocaleDateString()}`
      : now > expiryDate ? 'Coupon has expired' : 'Coupon is valid',
    type: 'date',
  });
  const hasUsageLeft = coupon.valid_till_user === 0 || coupon.user_coupon_count < coupon.valid_till_user;
  conditions.push({
    met: hasUsageLeft,
    message: hasUsageLeft ? `Usage: ${coupon.user_coupon_count}/${coupon.valid_till_user || '∞'}` : 'Usage limit reached',
    type: 'usage',
  });
  const meetsMinOrder = cartTotal >= coupon.discount_offer;
  conditions.push({
    met: meetsMinOrder,
    message: meetsMinOrder ? `Minimum order met (₹${coupon.discount_offer})`
      : `Add ₹${(coupon.discount_offer - cartTotal).toFixed(2)} more to meet minimum order of ₹${coupon.discount_offer}`,
    type: 'min_order',
  });
  if (coupon.coupon_type === 'coupon-on-specific') {
    const hasEligibleItems = checkEligibleItems(coupon, cartItems);
    const target = coupon.target_selection === 'Product' ? 'products' : 'categories';
    conditions.push({
      met: hasEligibleItems,
      message: hasEligibleItems ? `Cart contains eligible ${target}` : `No eligible ${target} in cart`,
      type: 'eligibility',
    });
  }
  return { canApply: conditions.every(c => c.met), conditions };
};

export const validateCoupon = (
  coupon: Coupon,
  cartTotal: number,
  cartItems: UnifiedCartItem[],
  isOnlinePayment: boolean = false
): CouponValidationResult => {
  const now = new Date();
  const startDate = new Date(coupon.start_date);
  const expiryDate = new Date(coupon.expiry_date);
  if (!coupon.is_active) return { isValid: false, message: 'This coupon is not active', reason: 'inactive' };
  if (now < startDate) return { isValid: false, message: `This coupon will be valid from ${startDate.toLocaleDateString()}`, reason: 'not_started' };
  if (now > expiryDate) return { isValid: false, message: 'This coupon has expired', reason: 'expired' };
  if (coupon.valid_till_user > 0 && coupon.user_coupon_count >= coupon.valid_till_user) {
    return { isValid: false, message: 'You have reached the usage limit for this coupon', reason: 'usage_limit' };
  }
  if (coupon.coupon_validity === 'Number of times' &&
      coupon.number_of_times != null && coupon.order_coupon_count != null &&
      coupon.order_coupon_count >= coupon.number_of_times) {
    return { isValid: false, message: 'This coupon has reached its usage limit', reason: 'usage_limit' };
  }
  if (coupon.is_online_payment && !isOnlinePayment) {
    return { isValid: false, message: 'This coupon is only valid for online payments', reason: 'payment_restriction' };
  }
  if (cartTotal < coupon.discount_offer) {
    return {
      isValid: false,
      message: `Minimum order value of ₹${coupon.discount_offer} required. Add ₹${(coupon.discount_offer - cartTotal).toFixed(2)} more to avail this coupon.`,
      reason: 'min_order',
    };
  }
  if (coupon.coupon_type === 'coupon-on-specific' && !checkEligibleItems(coupon, cartItems)) {
    const target = coupon.target_selection === 'Product' ? 'products' : 'categories';
    return {
      isValid: false,
      message: `This coupon is only valid for specific ${target}. Your cart doesn't contain eligible items.`,
      reason: 'no_eligible_items',
    };
  }
  return { isValid: true };
};

const checkEligibleItems = (coupon: Coupon, cartItems: UnifiedCartItem[]): boolean => {
  if (!coupon.coupon_details.length) return false;
  const eligibleUids = coupon.coupon_details.map(d => d.product_coupon_uid);
  if (coupon.target_selection === 'Product') {
    return cartItems.some(item => eligibleUids.includes(item.product_uid));
  }
  if (coupon.target_selection === 'Category') {
    return cartItems.some(item => eligibleUids.includes(item.category_uid));
  }
  return false;
};

export const calculateCouponDiscount = (
  coupon: Coupon,
  cartTotal: number,
  deliveryCharge: number,
  cartItems: UnifiedCartItem[]
): CouponDiscountResult => {
  const result: CouponDiscountResult = {
    discountAmount: 0,
    deliveryDiscount: 0,
    productDiscounts: new Map(),
    categoryDiscounts: new Map(),
    couponType: coupon.coupon_type,
  };
  switch (coupon.coupon_type) {
    case 'amount-cut-off':
      result.discountAmount = calcDiscount(cartTotal, coupon);
      break;
    case 'free-shipping':
      result.deliveryDiscount = deliveryCharge;
      result.discountAmount = deliveryCharge;
      break;
    case 'coupon-on-specific':
      result.discountAmount = calculateSpecificDiscount(coupon, cartItems, result);
      break;
  }
  return result;
};

const calcDiscount = (total: number, coupon: Coupon): number => {
  const discount = coupon.coupon_percentage 
    ? (total * coupon.coupon_percentage) / 100
    : coupon.coupon_discount_type === 'Value' ? total : 0;
  return Math.min(discount, coupon.maximum_discount_amount || Infinity, total);
};

const calculateSpecificDiscount = (
  coupon: Coupon,
  cartItems: UnifiedCartItem[],
  result: CouponDiscountResult
): number => {
  let totalDiscount = 0;
  const eligibleUids = coupon.coupon_details.map(detail => detail.product_coupon_uid);
  if (coupon.target_selection === 'Product') {
    cartItems.forEach(item => {
      if (eligibleUids.includes(item.product_uid)) {
        const itemTotal = item.price * item.product_count;
        const discount = calcDiscount(itemTotal, coupon);
        result.productDiscounts.set(item.product_uid, discount);
        totalDiscount += discount;
      }
    });
  } else if (coupon.target_selection === 'Category') {
    const categoryTotals = new Map<string, number>();
    cartItems.forEach(item => {
      if (eligibleUids.includes(item.category_uid)) {
        const current = categoryTotals.get(item.category_uid) || 0;
        categoryTotals.set(item.category_uid, current + item.price * item.product_count);
      }
    });
    categoryTotals.forEach((total, categoryUid) => {
      const discount = calcDiscount(total, coupon);
      result.categoryDiscounts.set(categoryUid, discount);
      totalDiscount += discount;
    });
  }
  return totalDiscount;
};

export interface BestCouponResult {
  coupon: Coupon | null;
  discount: CouponDiscountResult | null;
  savings: number;
}

const COUPON_PRIORITY: Record<string, number> = {
  'coupon-on-specific-Product': 4,
  'coupon-on-specific-Category': 3,
  'amount-cut-off': 2,
  'free-shipping': 1,
};

const getCouponPriority = (coupon: Coupon): number => {
  const key = coupon.coupon_type === 'coupon-on-specific'
    ? `${coupon.coupon_type}-${coupon.target_selection}`
    : coupon.coupon_type;
  return COUPON_PRIORITY[key] || 0;
};

export const selectBestCoupon = (
  coupons: Coupon[],
  cartTotal: number,
  deliveryCharge: number,
  cartItems: UnifiedCartItem[],
  isOnlinePayment: boolean = false
): BestCouponResult => {
  const validCoupons = coupons
    .filter(coupon => validateCoupon(coupon, cartTotal, cartItems, isOnlinePayment).isValid)
    .map(coupon => {
      const discount = calculateCouponDiscount(coupon, cartTotal, deliveryCharge, cartItems);
      return { coupon, discount, savings: discount.discountAmount };
    });
  if (validCoupons.length === 0) {
    return { coupon: null, discount: null, savings: 0 };
  }
  validCoupons.sort((a, b) => 
    b.savings !== a.savings 
      ? b.savings - a.savings 
      : getCouponPriority(b.coupon) - getCouponPriority(a.coupon)
  );
  const best = validCoupons[0];
  return { coupon: best.coupon, discount: best.discount, savings: best.savings };
};

export interface CouponFilterOptions {
  searchQuery?: string;
  category?: string;
  minDiscount?: number;
  maxDiscount?: number;
  couponType?: Coupon['coupon_type'];
}

export const filterCoupons = (coupons: Coupon[], options: CouponFilterOptions): Coupon[] => {
  let filtered = [...coupons];
  if (options.searchQuery) {
    const query = options.searchQuery.toLowerCase();
    filtered = filtered.filter(coupon =>
      coupon.coupon_code.toLowerCase().includes(query) ||
      coupon.description.toLowerCase().includes(query)
    );
  }
  if (options.couponType) {
    filtered = filtered.filter(coupon => coupon.coupon_type === options.couponType);
  }
  return filtered;
};

export type CouponSortBy = 'discount_desc' | 'discount_asc' | 'expiry_asc' | 'expiry_desc' | 'name_asc' | 'name_desc';

export const sortCoupons = (
  coupons: Coupon[],
  sortBy: CouponSortBy,
  cartTotal: number = 0,
  deliveryCharge: number = 0,
  cartItems: UnifiedCartItem[] = []
): Coupon[] => {
  const sorted = [...coupons];
  const getDiscount = (coupon: Coupon) => 
    calculateCouponDiscount(coupon, cartTotal, deliveryCharge, cartItems).discountAmount;
  const sortFunctions: Record<CouponSortBy, (a: Coupon, b: Coupon) => number> = {
    discount_desc: (a, b) => getDiscount(b) - getDiscount(a),
    discount_asc: (a, b) => getDiscount(a) - getDiscount(b),
    expiry_asc: (a, b) => new Date(a.expiry_date).getTime() - new Date(b.expiry_date).getTime(),
    expiry_desc: (a, b) => new Date(b.expiry_date).getTime() - new Date(a.expiry_date).getTime(),
    name_asc: (a, b) => a.coupon_code.localeCompare(b.coupon_code),
    name_desc: (a, b) => b.coupon_code.localeCompare(a.coupon_code),
  };
  return sorted.sort(sortFunctions[sortBy] || (() => 0));
};

export interface CouponDisplayInfo {
  type: string;
  discountText: string;
  minOrderText: string;
  validityText: string;
  usageText: string;
  daysLeft: number;
  isExpiringSoon: boolean;
}

const COUPON_TYPES: Record<string, string> = {
  'amount-cut-off': 'Cart Discount',
  'free-shipping': 'Free Delivery',
};

export const getCouponDisplayInfo = (coupon: Coupon): CouponDisplayInfo => {
  const expiryDate = new Date(coupon.expiry_date);
  const daysLeft = Math.ceil((expiryDate.getTime() - Date.now()) / (86400000));
  const type = coupon.coupon_type === 'coupon-on-specific'
    ? `${coupon.target_selection} Offer`
    : COUPON_TYPES[coupon.coupon_type] || 'Discount';
  const discountText = coupon.coupon_type === 'free-shipping'
    ? 'Free delivery on this order'
    : coupon.coupon_percentage
      ? `${coupon.coupon_percentage}% off${coupon.maximum_discount_amount ? ` (max ₹${coupon.maximum_discount_amount})` : ''}`
      : coupon.maximum_discount_amount ? `₹${coupon.maximum_discount_amount} off` : '';
  return {
    type,
    discountText,
    minOrderText: coupon.discount_offer > 0 ? `Min. order ₹${coupon.discount_offer}` : 'No minimum order',
    validityText: coupon.coupon_validity === 'Unlimited' 
      ? `Valid till ${expiryDate.toLocaleDateString()}`
      : `${coupon.number_of_times} uses available`,
    usageText: coupon.valid_till_user > 0 
      ? `${coupon.user_coupon_count}/${coupon.valid_till_user} uses`
      : 'Unlimited uses per user',
    daysLeft,
    isExpiringSoon: daysLeft <= 3 && daysLeft > 0,
  };
};
