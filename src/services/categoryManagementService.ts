import api from './api';
import { Category } from '@/types';

export const categoryManagementService = {
  async getCategories(): Promise<Category[]> {
    const response = await api.get<{ success: boolean; data: Category[] }>('/categories');
    return response.data.data || [];
  },

  async getAllCategories(): Promise<Category[]> {
    return this.getCategories();
  },

  async getCategoryById(id: string): Promise<Category> {
    const response = await api.get<{ category: Category }>(`/categories/${id}`);
    return response.data.category || response.data as any;
  },

  async getCategoryBySlug(slug: string): Promise<Category> {
    const response = await api.get<{ success: boolean; data: Category }>(`/categories/slug/${slug}`);
    return response.data.data || response.data as any;
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

  async getChildCategories(parentId: string): Promise<Category[]> {
    const allCategories = await this.getCategories();
    return allCategories.filter(cat => cat.parentId === parentId);
  },
};
