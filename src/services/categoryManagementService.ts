import api from './api';
import { Category } from '@/types';

export const categoryManagementService = {
  async getCategories(): Promise<Category[]> {
    const response = await api.get<{ categories: Category[] }>('/categories');
    return response.data.categories || response.data as any;
  },

  async getCategoryById(id: string): Promise<Category> {
    const response = await api.get<{ category: Category }>(`/categories/${id}`);
    return response.data.category || response.data as any;
  },

  async getCategoryBySlug(slug: string): Promise<Category> {
    const response = await api.get<{ category: Category }>(`/categories/slug/${slug}`);
    return response.data.category || response.data as any;
  },

  async createCategory(category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<Category> {
    const response = await api.post<{ category: Category }>('/categories', category);
    return response.data.category || response.data as any;
  },

  async updateCategory(id: string, category: Partial<Category>): Promise<Category> {
    const response = await api.put<{ category: Category }>(`/categories/${id}`, category);
    return response.data.category || response.data as any;
  },

  async deleteCategory(id: string): Promise<void> {
    await api.delete(`/categories/${id}`);
  },
};
