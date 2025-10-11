import { useState, useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../redux';
import { fetchOrderDetails, fetchOrderTimeline, fetchOrderUserDetails, fetchOrderSummary } from '../../store/slices/orderSlice';
import { OrderProduct, OrderTimelineItem, OrderUserDetails, OrderSummary } from '../../types/api';

interface UseOrderDetailsReturn {
  orderDetails: OrderProduct[];
  timeline: OrderTimelineItem[];
  userDetails: OrderUserDetails | null;
  orderSummary: OrderSummary | null;
  loading: boolean;
  error: string | null;
  isRefreshing: boolean;
  refreshOrderData: () => Promise<void>;
}

export const useOrderDetails = (orderUid: string | undefined): UseOrderDetailsReturn => {
  const dispatch = useAppDispatch();
  const { orderDetails, timeline, userDetails, orderSummary, main } = useAppSelector(state => state.order);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchAllOrderData = useCallback(async () => {
    if (!orderUid) return;
    try {
      await Promise.all([
        dispatch(fetchOrderDetails(orderUid)),
        dispatch(fetchOrderTimeline(orderUid)),
        dispatch(fetchOrderUserDetails(orderUid)),
        dispatch(fetchOrderSummary(orderUid))
      ]);
    } catch (error) {
      console.error('Failed to fetch order data:', error);
    }
  }, [orderUid, dispatch]);

  const refreshOrderData = useCallback(async () => {
    setIsRefreshing(true);
    await fetchAllOrderData();
    setIsRefreshing(false);
  }, [fetchAllOrderData]);

  useEffect(() => {
    if (orderUid) fetchAllOrderData();
  }, [orderUid, fetchAllOrderData]);

  return {
    orderDetails: orderDetails as OrderProduct[],
    timeline: timeline as OrderTimelineItem[],
    userDetails: userDetails as OrderUserDetails | null,
    orderSummary: orderSummary as OrderSummary | null,
    loading: main.loading,
    error: main.error,
    isRefreshing,
    refreshOrderData,
  };
};
