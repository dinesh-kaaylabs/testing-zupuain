import { useMemo } from 'react';
import { OrderProduct } from '../../types/api';
import { formatCurrency } from '../../utils/currencyFormatter';

interface OrderItemDisplay {
  id: number;
  product_uid: string;
  name: string;
  image: string;
  quantity: number;
  units?: string;
  unitPrice: number;
  unitPriceFormatted: string;
  totalPrice: number;
  totalPriceFormatted: string;
  hasDiscount: boolean;
  discountAmount: number;
  originalPrice: number;
}

interface UseOrderItemsReturn {
  items: OrderItemDisplay[];
  totalItems: number;
  hasMultipleItems: boolean;
}

export const useOrderItems = (products: OrderProduct[]): UseOrderItemsReturn => 
  useMemo(() => {
    if (!products?.length) return { items: [], totalItems: 0, hasMultipleItems: false };
    
    const items = products.map(p => ({
      id: p.order_details_id,
      product_uid: p.product_uid,
      name: p.product_name,
      image: p.product_image || '/placeholder-product.png',
      quantity: p.product_count,
      units: p.units,
      unitPrice: p.selling_price,
      unitPriceFormatted: formatCurrency(p.selling_price),
      totalPrice: p.selling_price * p.product_count,
      totalPriceFormatted: formatCurrency(p.selling_price * p.product_count),
      hasDiscount: p.product_discount_amount > 0,
      discountAmount: p.product_discount_amount,
      originalPrice: p.mrp_price || 0,
    }));

    return { items, totalItems: items.length, hasMultipleItems: items.length > 1 };
  }, [products]);