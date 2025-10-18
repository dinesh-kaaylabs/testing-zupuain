import { useMemo } from 'react';
import { Bag, CartItem, BagDetail } from '../types/api';

export const useDerivedCartItems = (
  isGuest: boolean,
  guestItems: CartItem[],
  bags: Bag[],
  filterParams?: { product_uid?: string; variant_id?: string; slug?: string }
): (BagDetail | CartItem)[] => {
  return useMemo(() => {
    const allItems = isGuest ? guestItems : bags.flatMap(bag => bag.bag_details || []);
    
    // If slug is 'BUY' and we have filter params, filter to show only matching item
    if (filterParams?.slug === 'BUY' && filterParams?.product_uid) {
      return allItems.filter(item => {
        const matchesProduct = item.product_uid === filterParams.product_uid;
        
        // If variant_id is specified, also match on variant
        if (filterParams.variant_id) {
          const itemVariantId = 'product_variant_id' in item 
            ? item.product_variant_id 
            : null;
          return matchesProduct && itemVariantId === filterParams.variant_id;
        }
        
        return matchesProduct;
      });
    }
    
    return allItems;
  }, [isGuest, guestItems, bags, filterParams]);
};
