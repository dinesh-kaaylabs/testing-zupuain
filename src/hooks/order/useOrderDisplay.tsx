import { useMemo } from 'react';
import { Order, OrderListItem } from '../../types/api';
import { formatCurrency } from '../../utils/currencyFormatter';

interface OrderDisplayData {
  orderNumber: string;
  orderId: string;
  formattedDate: string;
  formattedDateTime: string;
  formattedPrice: string;
  totalPrice: number;
  itemCount: number;
  itemCountText: string;
  status: string;
  statusDescription: string;
  deliveryDate: string | null;
  deliveryTime: string | null;
  deliverySlot: string | null;
}

interface OrdersDisplayData {
  orderNumber: string;
  orderId: string;
  formattedDate: string;
  formattedPrice: string;
  totalPrice: number;
  itemCount: number;
  itemCountText: string;
  status: string;
  statusDescription: string;
  rawOrder: Order | OrderListItem;
}

interface OrderStatistics {
  totalOrders: number;
  totalSpent: number;
  formattedTotalSpent: string;
  avgOrderValue: number;
  formattedAvgOrderValue: string;
  statusCounts: Record<string, number>;
  pendingCount: number;
  deliveredCount: number;
  cancelledCount: number;
}

/**
 * Format order for display in lists (dashboard, order history)
 * Returns consistent display format with all necessary fields
 */
export const useOrderDisplay = (order: Order | OrderListItem | null): OrderDisplayData | null => 
  useMemo(() => {
    if (!order) return null;
    
    return {
      orderNumber: order.order_serial_number || order.order_number,
      orderId: order.order_uid,
      formattedDate: new Date(order.creation_date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
      formattedDateTime: new Date(order.creation_date).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      formattedPrice: formatCurrency(order.total_price),
      totalPrice: order.total_price,
      itemCount: order.order_product_count,
      itemCountText: `${order.order_product_count} ${order.order_product_count === 1 ? 'item' : 'items'}`,
      status: order.milestone_code?.toLowerCase() || 'pending',
      statusDescription: order.milestone_description || 'Processing',
      deliveryDate: order.delivery_date 
        ? new Date(order.delivery_date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })
        : null,
      deliveryTime: order.delivery_time || null,
      deliverySlot: order.delivery_date && order.delivery_time
        ? `${new Date(order.delivery_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${order.delivery_time}`
        : null,
    };
  }, [order]);

/**
 * Format multiple orders for display
 */
export const useOrdersDisplay = (orders: (Order | OrderListItem)[] | null): OrdersDisplayData[] | null => 
  useMemo(() => {
    if (!orders || orders.length === 0) return null;
    
    return orders.map(order => ({
      orderNumber: order.order_serial_number || order.order_number,
      orderId: order.order_uid,
      formattedDate: new Date(order.creation_date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
      formattedPrice: formatCurrency(order.total_price),
      totalPrice: order.total_price,
      itemCount: order.order_product_count,
      itemCountText: `${order.order_product_count} ${order.order_product_count === 1 ? 'item' : 'items'}`,
      status: order.milestone_code?.toLowerCase() || 'pending',
      statusDescription: order.milestone_description || 'Processing',
      rawOrder: order,
    }));
  }, [orders]);

/**
 * Get status badge color from ORDER_STATUS_COLORS
 * This is a utility function, not a hook (doesn't use React hooks)
 */
export const getOrderStatusColor = (status: string): string => {
  const statusLower = status.toLowerCase();
  const colors: Record<string, string> = {
    delivered: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800',
    shipped: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800',
    processing: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800',
    cancelled: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800',
    confirmed: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800',
    pending: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800',
    default: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-400 dark:border-gray-800',
  };
  return colors[statusLower] || colors.default;
};

/**
 * Format order statistics for dashboard
 */
export const useOrderStatistics = (orders: (Order | OrderListItem)[] | null): OrderStatistics | null => 
  useMemo(() => {
    if (!orders || orders.length === 0) return null;
    
    const totalOrders = orders.length;
    const totalSpent = orders.reduce((sum, order) => sum + order.total_price, 0);
    const avgOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;
    
    const statusCounts = orders.reduce((acc, order) => {
      const status = order.milestone_code?.toLowerCase() || 'pending';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      totalOrders,
      totalSpent,
      formattedTotalSpent: formatCurrency(totalSpent),
      avgOrderValue,
      formattedAvgOrderValue: formatCurrency(avgOrderValue),
      statusCounts,
      pendingCount: statusCounts.pending || 0,
      deliveredCount: statusCounts.delivered || 0,
      cancelledCount: statusCounts.cancelled || 0,
    };
  }, [orders]);
