import api from './api';
import { Gear, GearFilters, PaginatedResponse } from '@/types';

export const gearService = {
  async getGear(
    filters?: GearFilters,
    page: number = 1,
    limit: number = 12
  ): Promise<PaginatedResponse<Gear>> {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    if (filters?.search) params.append('search', filters.search);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.minPrice !== undefined) params.append('minPrice', filters.minPrice.toString());
    if (filters?.maxPrice !== undefined) params.append('maxPrice', filters.maxPrice.toString());
    if (filters?.available !== undefined) params.append('available', filters.available.toString());
    if (filters?.brand) params.append('brand', filters.brand);

    const response = await api.get(`/gear?${params.toString()}`);
    return response.data;
  },

  async getGearById(id: string): Promise<Gear> {
    const response = await api.get(`/gear/${id}`);
    return response.data.gear || response.data;
  },

  async createGear(gear: Omit<Gear, 'id' | 'createdAt' | 'updatedAt'>): Promise<Gear> {
    const response = await api.post('/gear', gear);
    return response.data.gear || response.data;
  },

  async updateGear(id: string, gear: Partial<Gear>): Promise<Gear> {
    const response = await api.put(`/gear/${id}`, gear);
    return response.data.gear || response.data;
  },

  async deleteGear(id: string): Promise<void> {
    await api.delete(`/gear/${id}`);
  },
};

// Empty export for backward compatibility (no more mock data)
export const mockGear: Gear[] = [];
