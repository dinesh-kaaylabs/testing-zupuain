import { useState, useCallback, useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../redux';
import { useToast } from '../ui/useToast';
import { 
  fetchUserOrders,
  fetchOrderDetails as fetchOrderDetailsThunk,
  fetchOrderTimeline,
  fetchOrderUserDetails,
  fetchOrderSummary
} from '../../store/slices/orderSlice';
import { OrderListItem, OrderProduct, OrderSummary, OrderTimeline, OrderUserDetails } from '../../types/api';

interface OrderFilters {
  status: string;
  dateRange: { start: Date | null; end: Date | null };
  searchTerm: string;
  sortBy: 'date_desc' | 'date_asc' | 'amount_desc' | 'amount_asc';
}

const INITIAL_FILTERS: OrderFilters = {
  status: 'all',
  dateRange: { start: null, end: null },
  searchTerm: '',
  sortBy: 'date_desc',
};

const ITEMS_PER_PAGE = 10;

const SORT_FNS = {
  date_asc: (a: OrderListItem, b: OrderListItem) => 
    new Date(a.creation_date).getTime() - new Date(b.creation_date).getTime(),
  date_desc: (a: OrderListItem, b: OrderListItem) => 
    new Date(b.creation_date).getTime() - new Date(a.creation_date).getTime(),
  amount_asc: (a: OrderListItem, b: OrderListItem) => a.total_price - b.total_price,
  amount_desc: (a: OrderListItem, b: OrderListItem) => b.total_price - a.total_price,
};

interface OrderStatistics {
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
}

interface OrderDetailsState {
  products: OrderProduct[];
  summary: OrderSummary | null;
  timeline: OrderTimeline[];
  userDetails: OrderUserDetails | null;
  loading: boolean;
  error: string | null;
}

interface UseOrderHistoryReturn {
  orders: OrderListItem[];
  filteredOrders: OrderListItem[];
  selectedOrder: OrderListItem | null;
  orderDetails: OrderDetailsState;
  loading: boolean;
  error: string | null;
  filters: OrderFilters;
  currentPage: number;
  totalPages: number;
  showFilters: boolean;
  sortBy: 'date' | 'amount' | 'status';
  sortOrder: 'asc' | 'desc';
  fetchOrders: (page?: number) => Promise<void>;
  fetchOrderDetails: (orderUid: string) => Promise<void>;
  updateFilters: (newFilters: Partial<OrderFilters>) => void;
  clearFilters: () => void;
  selectOrder: (order: OrderListItem | null) => void;
  changePage: (page: number) => void;
  toggleFilters: () => void;
  handleSortChange: (field: 'date' | 'amount' | 'status') => void;
  toggleSortOrder: () => void;
  handleViewDetails: (order: OrderListItem) => void;
  handleReorder: (order: OrderListItem) => void;
  hasOrders: boolean;
  orderStatistics: OrderStatistics;
}

export const useOrderHistory = (): UseOrderHistoryReturn => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const orderState = useAppSelector((state) => state.order);
  const { error: errorToast } = useToast();
  
  const [selectedOrder, setSelectedOrder] = useState<OrderListItem | null>(null);
  const [filters, setFilters] = useState<OrderFilters>(INITIAL_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const totalPages = Math.ceil(orderState.totalOrderCount / ITEMS_PER_PAGE);

  const fetchOrders = useCallback(async (page = 1) => {
    if (!user) return;
    try {
      await dispatch(fetchUserOrders({
        limit: ITEMS_PER_PAGE,
        page,
        store_uid: user.store?.store_uid,
      })).unwrap();
      setCurrentPage(page);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      errorToast(errorMessage || 'Failed to fetch orders');
    }
  }, [dispatch, user, errorToast]);

  const fetchOrderDetails = useCallback(async (orderUid: string) => {
    try {
      await Promise.all([
        dispatch(fetchOrderDetailsThunk(orderUid)).unwrap(),
        dispatch(fetchOrderTimeline(orderUid)).unwrap(),
        dispatch(fetchOrderUserDetails(orderUid)).unwrap(),
        dispatch(fetchOrderSummary(orderUid)).unwrap(),
      ]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      errorToast(errorMessage || 'Failed to fetch order details');
    }
  }, [dispatch, errorToast]);

  const filteredOrders = useMemo(() => {
    let result = orderState.orders;
    
    if (filters.status !== 'all') {
      result = result.filter(o => o.milestone_code.toLowerCase() === filters.status.toLowerCase());
    }
    
    if (filters.dateRange.start || filters.dateRange.end) {
      result = result.filter(o => {
        const date = new Date(o.creation_date);
        return (!filters.dateRange.start || date >= filters.dateRange.start) &&
               (!filters.dateRange.end || date <= filters.dateRange.end);
      });
    }
    
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      result = result.filter(o =>
        o.order_serial_number.toLowerCase().includes(term) ||
        o.product_name.toLowerCase().includes(term)
      );
    }
    
    return [...result].sort(SORT_FNS[filters.sortBy]);
  }, [orderState.orders, filters]);

  const orderStatistics = useMemo(() => {
    const totalOrders = orderState.totalOrderCount || orderState.orders.length;
    const totalSpent = orderState.orders.reduce((sum, o) => sum + o.total_price, 0);
    return {
      totalOrders,
      totalSpent,
      averageOrderValue: totalOrders > 0 ? totalSpent / totalOrders : 0,
    };
  }, [orderState.orders, orderState.totalOrderCount]);

  const updateFilters = useCallback((newFilters: Partial<OrderFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const selectOrder = useCallback((order: OrderListItem | null) => {
    setSelectedOrder(order);
    if (order) fetchOrderDetails(order.order_uid);
  }, [fetchOrderDetails]);

  const changePage = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages) fetchOrders(page);
  }, [fetchOrders, totalPages]);

  useEffect(() => {
    if (user) fetchOrders();
  }, [user]);

  return {
    orders: orderState.orders,
    filteredOrders,
    selectedOrder,
    orderDetails: {
      products: orderState.orderDetails,
      summary: orderState.orderSummary,
      timeline: orderState.timeline,
      userDetails: orderState.userDetails,
      loading: orderState.main.loading,
      error: orderState.main.error,
    },
    loading: orderState.main.loading,
    error: orderState.main.error,
    filters,
    currentPage,
    totalPages,
    showFilters,
    sortBy: filters.sortBy.split('_')[0] as 'date' | 'amount' | 'status',
    sortOrder: filters.sortBy.split('_')[1] as 'asc' | 'desc',
    fetchOrders,
    fetchOrderDetails,
    updateFilters,
    clearFilters: () => setFilters(INITIAL_FILTERS),
    selectOrder,
    changePage,
    toggleFilters: () => setShowFilters(prev => !prev),
    handleSortChange: (field: 'date' | 'amount' | 'status') => {
      const order = filters.sortBy.split('_')[1] as 'asc' | 'desc';
      setFilters(prev => ({ ...prev, sortBy: `${field}_${order}` as OrderFilters['sortBy'] }));
    },
    toggleSortOrder: () => {
      const field = filters.sortBy.split('_')[0] as 'date' | 'amount';
      const newOrder = filters.sortBy.split('_')[1] === 'asc' ? 'desc' : 'asc';
      setFilters(prev => ({ ...prev, sortBy: `${field}_${newOrder}` as OrderFilters['sortBy'] }));
    },
    handleViewDetails: (order: OrderListItem) => window.location.href = `/order-tracking/${order.order_uid}`,
    handleReorder: (order: OrderListItem) => console.log('Reordering:', order.order_uid),
    hasOrders: orderState.orders.length > 0,
    orderStatistics,
  };
};
