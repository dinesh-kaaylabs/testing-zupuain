import { useMemo } from 'react';
import { UserCoupon } from '../../types/api';
import { useCurrencyFormatter } from '../../utils/currencyFormatter';

interface usePricingSummaryProps {
  subtotal: number;
  deliveryCharge: number;
  appliedCoupon: UserCoupon | null;
}

export const usePricingSummary = ({ subtotal, deliveryCharge, appliedCoupon }: usePricingSummaryProps) => {
  const { formatCurrency } = useCurrencyFormatter();
  const freeShippingInfo = useMemo(() => {
    const threshold = 500;
    const amountNeeded = Math.max(0, threshold - subtotal);
    const isFree = deliveryCharge === 0 || subtotal >= threshold;
    const progress = Math.min((subtotal / threshold) * 100, 100);
    return {
      freeShippingThreshold: threshold, amountForFreeShipping: amountNeeded, isFreeShipping: isFree,
      isFreeShippingCoupon: appliedCoupon?.coupon_type === 'free-shipping' && deliveryCharge === 0,
      progressPercentage: progress, showProgressBar: !isFree && amountNeeded > 0,
      showBadge: isFree && deliveryCharge === 0,
    };
  }, [subtotal, deliveryCharge, appliedCoupon]);
  return { formatCurrency, freeShippingInfo };
};
