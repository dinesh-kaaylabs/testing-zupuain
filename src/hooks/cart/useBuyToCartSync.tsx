import { useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux';
import { cartApi } from '../../services/cartApi';
import { fetchBag } from '../../store/slices/cartSlice';

const EXCLUDED_PATHS = ['/login', '/register', '/track', '/payment-success'];

export const useBuyToCartSync = () => {
  const { pathname, search } = useLocation();
  const dispatch = useAppDispatch();
  const syncedRef = useRef(false);
  
  const { isAuthenticated, user, defaultStore } = useAppSelector((state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user,
    defaultStore: state.store.defaultStore,
  }));

  const shouldSync = useCallback((path: string, params: string) => {
    const urlParams = new URLSearchParams(params);
    const hasBuyParams = urlParams.has('product_uid') || urlParams.has('showCheckout');
    
    return !EXCLUDED_PATHS.includes(path) && 
           !path.startsWith('/order/') && 
           !((path === '/cart' || path === '/bag' || path === '/checkout') && hasBuyParams);
  }, []);

  const syncBuyToCart = useCallback(async () => {
    if (!defaultStore?.store_uid) return;
    
    try {
      if (isAuthenticated && user?.user_uid) {
        const { success, data } = await cartApi.getBag(defaultStore.store_uid);
        if (!success || !data) return;

        const buyBags = data.filter((bag: any) => bag.slug === 'BUY');
        if (!buyBags.length) return;

        for (const bag of buyBags) {
          for (const detail of bag.bag_details || []) {
            const product = detail.zm_products?.[0];
            
            if (!product) continue;

            try {
              const variantId = detail.product_variant_id ? String(detail.product_variant_id) : undefined;
              
              await cartApi.removeFromCart({
                product_uid: product.product_uid,
                product_variant_id: variantId,
                slug: 'BUY',
                store_uid: defaultStore.store_uid,
              });
              
              await cartApi.addToCart({
                product: {
                  product_uid: product.product_uid,
                  product_count: detail.product_count,
                  track_inventory: product.track_inventory,
                  product_status: product.product_status,
                  product_variant_id: variantId,
                  id: variantId,
                  product_id: product.product_id,
                  price: product.price || '0',
                  mrp: product.mrp ?? '0',
                  min_order_quantity: product.min_order_quantity ?? 1,
                },
                slugData: 'CART',
                store_uid: defaultStore.store_uid,
              });
            } catch (err) {
              console.error('Sync item failed:', err);
            }
          }
        }
        await dispatch(fetchBag(defaultStore.store_uid));
      } else {
        const guestCart = localStorage.getItem('guestCart');
        if (!guestCart) return;

        const items = JSON.parse(guestCart);
        if (!items.some((i: any) => i.slug === 'BUY')) return;

        localStorage.setItem('guestCart', JSON.stringify(
          items.map((i: any) => i.slug === 'BUY' ? { ...i, slug: 'CART' } : i)
        ));
        await dispatch(fetchBag(defaultStore.store_uid));
      }
    } catch (err) {
      console.error('Sync failed:', err);
    }
  }, [isAuthenticated, user, defaultStore, dispatch]);

  useEffect(() => {
    if (!shouldSync(pathname, search)) {
      syncedRef.current = false;
      return;
    }
    
    if (!syncedRef.current && defaultStore?.store_uid) {
      syncedRef.current = true;
      syncBuyToCart();
    }
  }, [pathname, search, shouldSync, syncBuyToCart, defaultStore]);

  return { syncBuyToCart };
};

