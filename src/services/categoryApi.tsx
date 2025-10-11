import { apiClient } from './apiClient';
import { Category, ApiResponse } from '../types/api';
import { DEFAULT_LIMIT, INITIAL_OFFSET } from '../utils/constants';
import { withErrorHandling } from '../utils/apiResponseHandler';

export const categoryApi = {
  async getB2cCategories(limit = DEFAULT_LIMIT, offset = INITIAL_OFFSET): Promise<ApiResponse<Category[]>> {
    return withErrorHandling(
      () => apiClient.get<Category[]>('/category/get-b2c-category', {
        limit: limit.toString(),
        offset: offset.toString(),
      }),
      'Failed to fetch categories'
    );
  },
};
