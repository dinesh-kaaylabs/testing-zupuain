import { apiClient } from './apiClient';
import { Store, ApiResponse } from '../types/api';
import { withErrorHandling } from '../utils/apiResponseHandler';

export const storeApi = {
  async getStoreByPincode(pincode?: string): Promise<ApiResponse<Store[]>> {
    const params = pincode ? { pincode } : undefined;
    return withErrorHandling(
      () => apiClient.get<Store[]>('/store/store-by-pincode', params),
      'Failed to fetch stores by pincode'
    );
  },
};
