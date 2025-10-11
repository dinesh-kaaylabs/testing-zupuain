import { useMemo } from 'react';
import { OrderProduct } from '../../types/api';
import { formatCurrency } from '../../utils/currencyFormatter';

export const useOrderItems = (products: OrderProduct[] | null) => 
  useMemo(() => {
    if (!products?.length) return null;
    const items = products.map(p => ({
      id: p.order_details_id,
      product_uid: p.product_uid,
      name: p.product_name,
      image: p.product_image || '/placeholder-product.png',
      quantity: p.product_count,
      unitPrice: p.selling_price,
      unitPriceFormatted: formatCurrency(p.selling_price),
      totalPrice: p.selling_price * p.product_count,
      totalPriceFormatted: formatCurrency(p.selling_price * p.product_count),
      hasDiscount: p.product_discount_amount > 0,
      discountAmount: p.product_discount_amount,
      originalPrice: p.mrp_price,
    }));
    return { items, totalItems: items.length, hasMultipleItems: items.length > 1 };
  }, [products]);
