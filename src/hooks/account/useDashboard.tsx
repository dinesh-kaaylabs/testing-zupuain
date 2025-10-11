import { useEffect, useMemo, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../redux';
import { fetchUserOrders } from '../../store/slices/orderSlice';
import { fetchUserAddresses } from '../../store/slices/addressSlice';
import { getUserWishlist } from '../../store/slices/wishlistSlice';
import { DEFAULT_LIMIT, DEFAULTS, INITIAL_OFFSET } from '../../utils';
import { formatCurrency } from '../../utils/currencyFormatter';

const COMPLETED_STATUSES = ['delivered', 'cancelled'];

export const useDashboard = () => {
  const dispatch = useAppDispatch();
  const { orders, totalOrderCount, main } = useAppSelector((state) => state.order);
  const { addresses } = useAppSelector((state) => state.address);
  const { wishlistItems } = useAppSelector((state) => state.wishlist);
  const defaultStore = useAppSelector((state) => state.store.defaultStore);

  const fetchDashboardData = useCallback(() => {
    if (defaultStore?.store_uid) {
      dispatch(fetchUserOrders({ limit: DEFAULT_LIMIT, page: INITIAL_OFFSET, store_uid: defaultStore.store_uid }));
      dispatch(fetchUserAddresses());
      dispatch(getUserWishlist());
    }
  }, [dispatch, defaultStore?.store_uid]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const stats = useMemo(() => {
    const totalSpent = orders
      .filter(o => o.milestone_code === DEFAULTS.CHECKOUT_MILESTONE_CODE)
      .reduce((sum, o) => sum + o.total_price, 0);
    
    return {
      totalOrders: totalOrderCount || orders.length,
      totalSpent,
      savedAddresses: addresses.length,
      wishlistItems: wishlistItems.length,
    };
  }, [orders, totalOrderCount, addresses.length, wishlistItems.length]);

  const recentOrders = useMemo(() => 
    orders.slice(0, 5), [orders]);
    
  const pendingOrdersCount = useMemo(() => 
    orders.filter(o => !COMPLETED_STATUSES.includes(o.milestone_code.toLowerCase())).length,
    [orders]
  );

  return {
    stats,
    recentOrders,
    pendingOrdersCount,
    loading: main.loading,
    hasDefaultAddress: addresses.some(addr => addr.is_default),
    fetchDashboardData,
  };
};
