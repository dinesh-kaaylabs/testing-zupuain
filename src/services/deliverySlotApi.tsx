import { apiClient } from './apiClient';
import { DeliveryDay, ApiResponse } from '../types/api';
import { withErrorHandling } from '../utils/apiResponseHandler';

export const deliverySlotApi = {
  async getDeliverySlots(params: {
    dayName?: string;
    delivery_date?: string;
  }): Promise<ApiResponse<DeliveryDay[]>> {
    const queryParams: Record<string, string> = {};
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams[key] = value;
      }
    });

    return withErrorHandling(
      () => apiClient.get<DeliveryDay[]>('/settings/delivery-b2c-slots', queryParams),
      'Failed to fetch delivery slots'
    );
  },
};
