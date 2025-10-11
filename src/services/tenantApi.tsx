import { apiClient } from './apiClient';
import { Tenant, ApiResponse } from '../types/api';
import { withErrorHandling } from '../utils/apiResponseHandler';

export const tenantApi = {
  async getTenant(): Promise<ApiResponse<Tenant>> {
    return withErrorHandling(
      () => apiClient.get<Tenant>('/tenant'),
      'Failed to fetch tenant information'
    );
  },
};
