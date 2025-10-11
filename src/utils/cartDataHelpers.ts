import { useMemo } from 'react';
import { Bag, CartItem, BagDetail } from '../types/api';

export const useDerivedCartItems = (
  isGuest: boolean,
  guestItems: CartItem[],
  bags: Bag[]
): (BagDetail | CartItem)[] => {
  return useMemo(() => 
    isGuest ? guestItems : bags.flatMap(bag => bag.bag_details || []),
    [isGuest, guestItems, bags]
  );
};
