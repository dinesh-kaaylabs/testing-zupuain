import { apiClient } from './apiClient';
import { Bag, CartItem, ApiResponse } from '../types/api';
import { withErrorHandling } from '../utils/apiResponseHandler';

interface AddToCartRequest extends Record<string, unknown> {
  product: {
    product_uid: string;
    product_count: number;
    track_inventory: boolean;
    product_status: boolean;
    product_id: number;
    product_variant_id?: string;
    price: string;
    mrp: string;
    min_order_quantity?: number;
  };
  slugData: string;
  store_uid: string;
}

interface BulkCartRequest extends Record<string, unknown> {
  product: Array<{
    product_uid: string;
    product_count: number;
    track_inventory: boolean;
    product_status: boolean;
    product_id: number;
    product_variant_id?: string;
    slug: string;
    mrp: string;
    price: string;
    min_order_quantity?: number;
  }>;
  store_uid: string;
}

export const cartApi = {
  async getBag(store_uid: string): Promise<ApiResponse<Bag[]>> {
    return withErrorHandling(
      () => apiClient.get<Bag[]>('/bag', { store_uid }),
      'Failed to fetch cart'
    );
  },

  async addToCart(request: AddToCartRequest): Promise<ApiResponse<number[]>> {
    return withErrorHandling(
      () => apiClient.post<number[]>('/bag', request),
      'Failed to add to cart'
    );
  },

  async createBulkBagProduct(request: BulkCartRequest): Promise<ApiResponse<{ message: string }>> {
    return withErrorHandling(
      () => apiClient.post<{ message: string }>('/bag/createBulkBagProduct', request),
      'Failed to create bulk bag'
    );
  },

  async incrementQuantity(data: {
    product_uid: string;
    slug: string;
    store_uid: string;
  }): Promise<ApiResponse<{ success: boolean }>> {
    return withErrorHandling(
      () => apiClient.put<{ success: boolean }>('/bag/quantity-increment', data),
      'Failed to increment quantity'
    );
  },

  async decrementQuantity(data: {
    product_uid: string;
    product_variant_id?: string;
    slug: string;
    store_uid: string;
  }): Promise<ApiResponse<{ success: boolean }>> {
    return withErrorHandling(
      () => apiClient.put<{ success: boolean }>('/bag/quantity-decrement', data),
      'Failed to decrement quantity'
    );
  },

  async removeFromCart(params: {
    product_uid: string;
    product_variant_id?: string;
    slug: string;
    store_uid: string;
  }): Promise<ApiResponse<{ success: boolean }>> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });

    return withErrorHandling(
      () => apiClient.delete<{ success: boolean }>(`/bag/delete?${queryParams.toString()}`),
      'Failed to remove from cart'
    );
  },
};
