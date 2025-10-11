import { apiClient } from './apiClient';
import { Product, ApiResponse } from '../types/api';
import { withErrorHandling } from '../utils/apiResponseHandler';

export const wishlistApi = {
  async getUserWishlist(): Promise<ApiResponse<Product[]>> {
    return withErrorHandling(
      () => apiClient.get<Product[]>('/wishlist'),
      'Failed to fetch wishlist'
    );
  },

  async addToWishlist(productUid: string): Promise<ApiResponse<Product>> {
    return withErrorHandling(
      () => apiClient.post<Product>('/wishlist/add', { product_uid: productUid }),
      'Failed to add to wishlist'
    );
  },

  async removeFromWishlist(productUid: string): Promise<ApiResponse<void>> {
    return withErrorHandling(
      () => apiClient.delete<void>(`/wishlist/remove?product_uid=${productUid}`),
      'Failed to remove from wishlist'
    );
  },

  async moveToCart(productUid: string): Promise<ApiResponse<void>> {
    return withErrorHandling(
      () => apiClient.post<void>('/wishlist/move-to-cart', { product_uid: productUid }),
      'Failed to move to cart'
    );
  },
};
