import { ReactNode } from 'react';
import { useBuyToCartSync } from '../../hooks/cart/useBuyToCartSync';

const BuyToCartSyncProvider = ({ children }: { children: ReactNode }) => {
  useBuyToCartSync();
  return <>{children}</>;
};

export default BuyToCartSyncProvider;

