import { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../redux';
import { getDeliveryCharge } from '../../store/slices/deliveryChargeSlice';
import { UserCoupon } from '../../types/api';
import { CouponDiscountResult } from '../../utils/couponUtils';
import { useCurrencyFormatter } from '../../utils/currencyFormatter';

interface UsePricingProps {
  subtotal: number;
  appliedCoupon: UserCoupon | null;
  appliedDiscount: CouponDiscountResult | null;
  storeUid?: string;
  selectedPaymentMethod?: { slug: string } | null;
}

export const usePricing = ({ subtotal, appliedCoupon, appliedDiscount, storeUid, selectedPaymentMethod }: UsePricingProps) => {
  const dispatch = useAppDispatch();
  const { deliveryCharge, loading: deliveryChargeLoading } = useAppSelector((state) => state.deliveryCharge);
  const codChargeAmount = useAppSelector((state) => state.tenant.defaultTenant?.setting?.cod_charge || 0);
  const { formatCurrency } = useCurrencyFormatter();
  useEffect(() => {
    if (storeUid) dispatch(getDeliveryCharge(storeUid));
  }, [dispatch, storeUid]);
  const pricing = useMemo(() => {
    const baseDeliveryFee = deliveryCharge?.delivery_charge || 0;
    const deliveryDiscount = Math.min(appliedDiscount?.deliveryDiscount || 0, baseDeliveryFee);
    const finalDeliveryCharge = Math.max(0, baseDeliveryFee - deliveryDiscount);
    const totalDiscount = appliedDiscount?.discountAmount || 0;
    const productDiscount = totalDiscount - deliveryDiscount;
    const isCOD = selectedPaymentMethod?.slug === 'cod';
    const codCharge = isCOD ? codChargeAmount : 0;
    const total = Math.max(0, subtotal - productDiscount + finalDeliveryCharge + codCharge);
    return {
      subtotal, deliveryCharge: finalDeliveryCharge, baseDeliveryCharge: baseDeliveryFee,
      deliveryDiscount, productDiscount, discount: totalDiscount, tax: 0, codCharge, total,
      couponApplied: !!appliedCoupon, isFreeDelivery: finalDeliveryCharge === 0 && baseDeliveryFee > 0,
    };
  }, [subtotal, deliveryCharge, appliedCoupon, appliedDiscount, selectedPaymentMethod, codChargeAmount]);
  const totalSavings = pricing.discount;
  const isFreeDeliveryEligible = pricing.isFreeDelivery;
  const discountBreakdown = useMemo(() => {
    if (!appliedDiscount) return [];
    const breakdown: Array<{ label: string; amount: number }> = [];
    appliedDiscount.productDiscounts.forEach((discount) => 
      breakdown.push({ label: 'Product Discount', amount: discount }));
    appliedDiscount.categoryDiscounts.forEach((discount) => 
      breakdown.push({ label: 'Category Discount', amount: discount }));
    if (appliedDiscount.couponType === 'amount-cut-off' && pricing.productDiscount > 0) {
      breakdown.push({ label: 'Cart Discount', amount: pricing.productDiscount });
    }
    if (appliedDiscount.deliveryDiscount > 0) {
      breakdown.push({ label: 'Free Delivery', amount: appliedDiscount.deliveryDiscount });
    }
    return breakdown;
  }, [appliedDiscount, pricing.productDiscount]);
  const deliveryChargeInfo = useMemo(() => ({
    baseCharge: pricing.baseDeliveryCharge, finalCharge: pricing.deliveryCharge,
    saved: pricing.deliveryDiscount, isFree: pricing.deliveryCharge === 0 && pricing.baseDeliveryCharge > 0,
    hasDiscount: pricing.deliveryDiscount > 0,
  }), [pricing]);
  const pricingSummary = useMemo(() => ({
    subtotal: formatCurrency(pricing.subtotal), deliveryCharge: formatCurrency(pricing.deliveryCharge),
    baseDeliveryCharge: formatCurrency(pricing.baseDeliveryCharge), deliveryDiscount: formatCurrency(pricing.deliveryDiscount),
    productDiscount: formatCurrency(pricing.productDiscount), discount: formatCurrency(pricing.discount),
    tax: formatCurrency(pricing.tax), codCharge: formatCurrency(pricing.codCharge), 
    total: formatCurrency(pricing.total), savings: formatCurrency(totalSavings),
  }), [pricing, totalSavings, formatCurrency]);
  const refreshDeliveryCharge = () => {
    if (storeUid) dispatch(getDeliveryCharge(storeUid));
  };
  return {
    pricing, pricingSummary, totalSavings, potentialSavings: totalSavings, 
    discountBreakdown, deliveryChargeInfo, deliveryCharge, deliveryChargeLoading, 
    isFreeDeliveryEligible, formatCurrency, refreshDeliveryCharge,
  };
};
