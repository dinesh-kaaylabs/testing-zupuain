import { apiClient } from './apiClient';
import { Address, ApiResponse } from '../types/api';
import { withErrorHandling, handleApiResponse } from '../utils/apiResponseHandler';

interface CreateAddressRequest extends Record<string, unknown> {
  address_tag: string;
  city: string;
  complete_address: string;
  confirmation: boolean;
  country: string;
  is_default: boolean;
  landmark?: string;
  pincode: string;
  state: string;
}

export const addressApi = {
  // Get user addresses
  getUserAddresses: async (): Promise<ApiResponse<Address[]>> => {
    return withErrorHandling(
      () => apiClient.get<Address[]>('/address'),
      'Failed to fetch addresses'
    );
  },

  // Create new address
  createAddress: async (addressData: CreateAddressRequest): Promise<ApiResponse<Address>> => {
    return withErrorHandling(
      () => apiClient.post<Address>('/address/create', addressData),
      'Failed to create address'
    );
  },

  // Update existing address
  updateAddress: async (addressId: string, addressData: CreateAddressRequest): Promise<ApiResponse<Address>> => {
    return withErrorHandling(
      () => apiClient.put<Address>(`/address/update/${addressId}`, addressData),
      'Failed to update address'
    );
  },

  // Delete address
  deleteAddress: async (addressId: string): Promise<ApiResponse<void>> => {
    return withErrorHandling(
      () => apiClient.delete(`/address/delete/${addressId}`),
      'Failed to delete address'
    );
  },

  // Set default address
  setDefaultAddress: async (addressId: string): Promise<ApiResponse<void>> => {
    return withErrorHandling(
      () => apiClient.put(`/address/set-default/${addressId}`),
      'Failed to set default address'
    );
  }
};
