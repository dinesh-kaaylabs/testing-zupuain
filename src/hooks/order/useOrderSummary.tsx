import { useMemo } from 'react';
import { OrderSummary } from '../../types/api';
import { formatCurrency as fc } from '../../utils/currencyFormatter';

interface OrderSummaryLineItem {
  label: string;
  value: string;
  icon: string;
  className: string;
  isPositive?: boolean;
}

interface UseOrderSummaryReturn {
  lineItems: OrderSummaryLineItem[];
  totalFormatted: string;
  hasDiscount: boolean;
  savingsAmount: number;
  savingsFormatted: string;
}

interface UseOrderSummaryConditionsReturn {
  isHighValue: boolean;
}

export const useOrderSummary = (summary: OrderSummary): UseOrderSummaryReturn => 
  useMemo(() => {
    if (!summary) return { lineItems: [], totalFormatted: '', hasDiscount: false, savingsAmount: 0, savingsFormatted: '' };
    const { order_price: op, order_discount_amount: oda, delivery_charge: dc, cod_charge: cc, order_gst_amount: oga, total_price: tp } = summary;
    const isFree = dc === 0;
    return {
      lineItems: [
        { label: 'Subtotal', value: fc(op), icon: 'dollar-sign', className: 'text-gray-700' },
        ...(oda > 0 ? [{ label: 'Discount', value: `-${fc(oda)}`, icon: 'tag', className: 'text-green-700', isPositive: true }] : []),
        { label: 'Delivery', value: isFree ? 'FREE' : fc(dc), icon: 'truck', className: isFree ? 'text-green-600' : 'text-gray-700', isPositive: isFree },
        ...(cc && cc > 0 ? [{ label: 'COD Charge', value: fc(cc), icon: 'credit-card', className: 'text-gray-700' }] : []),
        ...(oga > 0 ? [{ label: 'GST', value: fc(oga), icon: 'file-text', className: 'text-gray-700' }] : []),
      ],
      totalFormatted: fc(tp),
      hasDiscount: oda > 0,
      savingsAmount: oda,
      savingsFormatted: fc(oda),
    };
  }, [summary]);

export const useOrderSummaryConditions = (summary: OrderSummary | null): UseOrderSummaryConditionsReturn | null => 
  useMemo(() => summary ? { isHighValue: summary.total_price > 5000 } : null, [summary]);
