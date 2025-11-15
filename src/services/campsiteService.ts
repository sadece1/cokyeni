import api from './api';
import { Campsite, CampsiteFilters, PaginatedResponse } from '@/types';

export const campsiteService = {
  async getCampsites(
    filters?: CampsiteFilters,
    page: number = 1,
    limit: number = 12
  ): Promise<PaginatedResponse<Campsite>> {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    if (filters?.search) params.append('search', filters.search);
    if (filters?.region) params.append('region', filters.region);
    if (filters?.minPrice !== undefined) params.append('minPrice', filters.minPrice.toString());
    if (filters?.maxPrice !== undefined) params.append('maxPrice', filters.maxPrice.toString());
    if (filters?.available !== undefined) params.append('available', filters.available.toString());
    if (filters?.amenities?.length) {
      filters.amenities.forEach(amenity => params.append('amenities', amenity));
    }

    const response = await api.get(`/campsites?${params.toString()}`);
    return response.data;
  },

  async getCampsiteById(id: string): Promise<Campsite> {
    const response = await api.get(`/campsites/${id}`);
    return response.data.campsite || response.data;
  },

  async createCampsite(campsite: Omit<Campsite, 'id' | 'createdAt' | 'updatedAt'>): Promise<Campsite> {
    const response = await api.post('/campsites', campsite);
    return response.data.campsite || response.data;
  },

  async updateCampsite(id: string, campsite: Partial<Campsite>): Promise<Campsite> {
    const response = await api.put(`/campsites/${id}`, campsite);
    return response.data.campsite || response.data;
  },

  async deleteCampsite(id: string): Promise<void> {
    await api.delete(`/campsites/${id}`);
  },
};
