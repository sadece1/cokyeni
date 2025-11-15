import api from './api';
import { UserOrder, UserOrderForm } from '@/types';

export const userOrderService = {
  async createOrder(data: UserOrderForm): Promise<UserOrder> {
    const response = await api.post<{ order: UserOrder }>('/user-orders', data);
    return response.data.order || response.data as any;
  },

  async getOrders(userId?: string): Promise<UserOrder[]> {
    const params = userId ? `?userId=${userId}` : '';
    const response = await api.get<{ orders: UserOrder[] }>(`/user-orders${params}`);
    return response.data.orders || response.data as any;
  },

  async getOrderById(id: string): Promise<UserOrder> {
    const response = await api.get<{ order: UserOrder }>(`/user-orders/${id}`);
    return response.data.order || response.data as any;
  },

  async updateOrder(id: string, data: Partial<UserOrder>): Promise<UserOrder> {
    const response = await api.put<{ order: UserOrder }>(`/user-orders/${id}`, data);
    return response.data.order || response.data as any;
  },

  async deleteOrder(id: string): Promise<void> {
    await api.delete(`/user-orders/${id}`);
  },
};
