import { apiClient } from './apiClient';
import { UserCoupon, ApiResponse } from '../types/api';
import { withErrorHandling } from '../utils/apiResponseHandler';

export const couponApi = {
  /**
   * Get user-specific coupons with usage tracking
   */
  async getUserCoupons(params: {
    user_uid: string;
    is_active?: number;
    searchWord?: string;
  }): Promise<ApiResponse<UserCoupon[]>> {
    const queryParams: Record<string, string> = {};
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams[key] = value.toString();
      }
    });

    return withErrorHandling(
      () => apiClient.get<UserCoupon[]>('/coupon/get-user-coupon', queryParams),
      'Failed to fetch coupons'
    );
  },

  /**
   * Get all available coupons for guests (no user tracking)
   */
  async getAllCoupons(params?: {
    is_active?: number;
    searchWord?: string;
  }): Promise<ApiResponse<UserCoupon[]>> {
    const queryParams: Record<string, string> = {
      is_active: '1', // Default to active coupons only
    };
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams[key] = value.toString();
        }
      });
    }

    return withErrorHandling(
      () => apiClient.get<UserCoupon[]>('/coupon/get-user-coupon', queryParams),
      'Failed to fetch coupons'
    );
  },

  /**
   * Validate a coupon code
   */
  async validateCoupon(params: {
    coupon_code: string;
    user_uid?: string;
  }): Promise<ApiResponse<UserCoupon>> {
    return withErrorHandling(
      () => apiClient.post<UserCoupon>('/coupon/validate-coupon', params),
      'Failed to validate coupon'
    );
  },
};
