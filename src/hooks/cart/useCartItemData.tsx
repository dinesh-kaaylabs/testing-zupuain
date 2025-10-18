import { useMemo } from 'react';
import { BagDetail, CartItem } from '../../types/api';

interface CartItemData {
  isBag: boolean;
  name?: string;
  image?: string;
  quantity: number;
  price: number;
  mrp: number;
  productUid: string;
  discount?: number;
  discountPercent?: number;
  stock?: number;
  isAvailable?: boolean;
  units?: string;
}

const calcDiscount = (mrp: number, price: number) => {
  const d = mrp - price;
  return d > 0 ? { discount: d, discountPercent: Math.round((d / mrp) * 100) } : { discount: 0, discountPercent: 0 };
};

const checkAvailability = (status: boolean, trackInv: boolean, stock?: string | number) => 
  !!(status && (!trackInv || (stock && +stock > 0)));

export const useCartItemData = (item: BagDetail | CartItem): CartItemData => {
  return useMemo(() => {
    const isBag = 'bag_detail_id' in item;
    const p = isBag ? item.zm_products?.[0] : undefined;
    
    const mrp = isBag ? item.mrp_price : +item.mrp;
    const price = isBag ? item.selling_price : +item.price;
    const stock = isBag ? p?.stock : item.stock;
    
    return {
      isBag,
      name: isBag ? p?.product_name : item.product_name,
      image: isBag ? p?.product_image?.[0]?.product_image : item.product_image,
      quantity: item.product_count,
      price,
      mrp,
      productUid: item.product_uid,
      ...calcDiscount(mrp, price),
      stock: stock ? +stock : undefined,
      isAvailable: checkAvailability(
        isBag ? p?.product_status ?? false : item.product_status,
        isBag ? p?.track_inventory ?? false : item.track_inventory,
        stock ?? undefined
      ),
      units: isBag ? item.units : undefined,
    };
  }, [item]);
};

