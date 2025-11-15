import api from './api';
import { NewsletterSubscription, PaginatedResponse } from '@/types';

export const newsletterService = {
  async subscribe(email: string): Promise<NewsletterSubscription> {
    const response = await api.post<{ subscription: NewsletterSubscription }>('/newsletters', { email });
    return response.data.subscription || response.data as any;
  },

  async getSubscriptions(page = 1): Promise<PaginatedResponse<NewsletterSubscription>> {
    const response = await api.get<PaginatedResponse<NewsletterSubscription>>('/newsletters', {
      params: { page },
    });
    return response.data;
  },

  async unsubscribe(id: string): Promise<void> {
    await api.patch(`/newsletters/${id}/unsubscribe`);
  },

  async deleteSubscription(id: string): Promise<void> {
    await api.delete(`/newsletters/${id}`);
  },
};
