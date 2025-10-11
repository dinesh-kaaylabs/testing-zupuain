import { apiClient } from './apiClient';
import { PaymentMethod, OrderListItem, OrderProduct, OrderTimelineItem, OrderUserDetails, OrderSummary, CreateOrderBodyRequest, ApiResponse } from '../types/api';
import { withErrorHandling } from '../utils/apiResponseHandler';

export const orderApi = {
  async getPaymentMethods(appType: string): Promise<ApiResponse<PaymentMethod[]>> {
    return withErrorHandling(
      () => apiClient.get<PaymentMethod[]>('/order/get-payment-methods', { appType }),
      'Failed to fetch payment methods'
    );
  },

  async getUserOrders(params: { 
    limit: number; 
    page: number; 
    store_uid?: string 
  }): Promise<ApiResponse<{ count: number; rows: OrderListItem[] }>> {
    return withErrorHandling(
      async () => {
        return await apiClient.get<{ count: number; rows: OrderListItem[] }>('/order', {
          limit: params.limit.toString(),
          page: params.page.toString(),
          ...(params.store_uid && { store_uid: params.store_uid })
        });
      },
      'Failed to fetch orders'
    );
  },

  async getOrderProducts(orderUid: string): Promise<ApiResponse<OrderProduct[]>> {
    return withErrorHandling(
      () => apiClient.get<OrderProduct[]>('/order-detail/order/products', { order_uid: orderUid }),
      'Failed to fetch order products'
    );
  },

  async getOrderTracking(params: {
    order_uid: string;
    store_uid: string;
  }): Promise<ApiResponse<{ count: number; rows: OrderListItem[] }>> {
    return withErrorHandling(
      () => apiClient.get<{ count: number; rows: OrderListItem[] }>('/order', params),
      'Failed to fetch order tracking'
    );
  },

  async getOrderTimeline(orderUid: string): Promise<ApiResponse<OrderTimelineItem[]>> {
    return withErrorHandling(
      () => apiClient.get<OrderTimelineItem[]>('/order-detail/timeline/get-timeline', { order_uid: orderUid }),
      'Failed to fetch order timeline'
    );
  },

  async getOrderUserDetails(orderUid: string): Promise<ApiResponse<OrderUserDetails>> {
    return withErrorHandling(
      () => apiClient.get<OrderUserDetails>('/order-detail/order/user-details', { order_uid: orderUid }),
      'Failed to fetch order user details'
    );
  },

  async getOrderSummary(orderUid: string): Promise<ApiResponse<OrderSummary>> {
    return withErrorHandling(
      () => apiClient.get<OrderSummary>('/order-detail/order/summary-details', { order_uid: orderUid }),
      'Failed to fetch order summary'
    );
  },

  async createCartOrder(orderData: CreateOrderBodyRequest): Promise<ApiResponse<{
    urlLink: string;
    order_uid: string;
    success: boolean;
  }>> {    
    return withErrorHandling(
      async () => {
        const response = await apiClient.post<{
          urlLink: string;
          order_uid: string;
          success: boolean;
        }>('/order/create-cart', orderData);
        return response;
      },
      'Failed to create order'
    );
  },

  async verifyRazorpayPayment(paymentData: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    slug: string;
  }): Promise<ApiResponse<{ success: boolean; message: string }>> {
    return withErrorHandling(
      () => apiClient.post<{ success: boolean; message: string }>('/order/rzp-order-payment-success', paymentData),
      'Failed to verify payment'
    );
  },

  async cancelOrder(orderUid: string, reason?: string): Promise<ApiResponse<{ success: boolean; message: string }>> {
    return withErrorHandling(
      () => apiClient.post<{ success: boolean; message: string }>('/order/cancel', {
        order_uid: orderUid,
        cancellation_reason: reason
      }),
      'Failed to cancel order'
    );
  },

  async updateOrderStatus(orderUid: string, milestoneCode: string, notes?: string): Promise<ApiResponse<{ success: boolean; message: string }>> {
    return withErrorHandling(
      () => apiClient.put<{ success: boolean; message: string }>('/order/update-status', {
        order_uid: orderUid,
        milestone_code: milestoneCode,
        notes
      }),
      'Failed to update order status'
    );
  },

  async bulkUpdateOrderStatus(orderUids: string[], milestoneCode: string): Promise<ApiResponse<{ success: boolean; message: string }>> {
    return withErrorHandling(
      () => apiClient.put<{ success: boolean; message: string }>('/order/bulk-update-status', {
        order_uids: orderUids,
        milestone_code: milestoneCode
      }),
      'Failed to bulk update order status'
    );
  },
};
