import api from './api';
import { Message, PaginatedResponse } from '@/types';

export const messageService = {
  async getMessages(page = 1): Promise<PaginatedResponse<Message>> {
    const response = await api.get<PaginatedResponse<Message>>('/messages', {
      params: { page },
    });
    return response.data;
  },

  async getMessageById(id: string): Promise<Message> {
    const response = await api.get<{ message: Message }>(`/messages/${id}`);
    return response.data.message || response.data as any;
  },

  async markAsRead(id: string): Promise<Message> {
    const response = await api.patch<{ message: Message }>(`/messages/${id}/read`);
    return response.data.message || response.data as any;
  },

  async deleteMessage(id: string): Promise<void> {
    await api.delete(`/messages/${id}`);
  },
};
