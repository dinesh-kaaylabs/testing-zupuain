import { apiClient } from './apiClient';
import { ApiResponse, NewsletterSubscriber } from '../types/api';
import { withErrorHandling } from '../utils/apiResponseHandler';

export const newsletterApi = {
  async subscribe(email: string): Promise<ApiResponse<NewsletterSubscriber>> {
    return withErrorHandling(
      () => apiClient.post<NewsletterSubscriber>('/newsletter/subscribe', { email }),
      'Failed to subscribe to newsletter'
    );
  },
};
