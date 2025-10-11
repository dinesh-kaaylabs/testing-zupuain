import { apiClient } from './apiClient';
import { ApiResponse } from '../types/api';
import { withErrorHandling } from '../utils/apiResponseHandler';

interface DeliveryChargeData {
  delivery_charge: number;
}

interface DeliveryChargeCriteria {
  criteria_id: string;
  delivery_charge: number;
  criteria_name: string;
  is_active: boolean;
  tenant_uid: string;
  creation_date: string;
  modified_date: string;
}

interface CartChargeMapping {
  id: number;
  criteria_id: string;
  minimum_charge: number;
  maximum_charge: number;
  is_active: boolean;
}

interface WeightChargeMapping {
  id: number;
  criteria_id: string;
  minimum_weight: number;
  maximum_weight: number;
  details: string;
  is_active: boolean;
}

interface DeliveryChargeCriteriaByCartPrice extends DeliveryChargeCriteria {
  cart_charge_mapped: CartChargeMapping;
}

interface DeliveryChargeCriteriaByWeight extends DeliveryChargeCriteria {
  weight_charge_mapped: WeightChargeMapping;
}

export const deliveryChargeApi = {
  async getDeliveryCharge(): Promise<ApiResponse<DeliveryChargeData[]>> {
    return withErrorHandling(
      () => apiClient.get<DeliveryChargeData[]>('/delivery_charge/get-delivery-charge'),
      'Failed to fetch delivery charge'
    );
  },

  async getDeliveryChargeCriteria(): Promise<ApiResponse<DeliveryChargeCriteria[]>> {
    return withErrorHandling(
      () => apiClient.get<DeliveryChargeCriteria[]>('/delivery_charge_criteria/getAll'),
      'Failed to fetch delivery charge criteria'
    );
  },

  async getDeliveryChargeCriteriaByCartPrice(): Promise<ApiResponse<{
    count: number;
    rows: DeliveryChargeCriteriaByCartPrice[];
  }>> {
    return withErrorHandling(
      () => apiClient.get<{
        count: number;
        rows: DeliveryChargeCriteriaByCartPrice[];
      }>('/delivery_charge_criteria/getByCartPrice'),
      'Failed to fetch delivery charge criteria by cart price'
    );
  },

  async getDeliveryChargeCriteriaByWeight(): Promise<ApiResponse<{
    count: number;
    rows: DeliveryChargeCriteriaByWeight[];
  }>> {
    return withErrorHandling(
      () => apiClient.get<{
        count: number;
        rows: DeliveryChargeCriteriaByWeight[];
      }>('/delivery_charge_criteria/getByWeight'),
      'Failed to fetch delivery charge criteria by weight'
    );
  },
};
