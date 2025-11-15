import api from './api';
import { Gear } from '@/types';

interface CategoryInfo {
  name: string;
  description?: string;
}

interface CategoryData {
  info: CategoryInfo;
  gear: Gear[];
}

export const categoryService = {
  async getCategoryGear(slug: string): Promise<CategoryData> {
    try {
      const response = await api.get<{ category: CategoryInfo; gear: Gear[] }>(`/categories/slug/${slug}/gear`);
      return {
        info: response.data.category,
        gear: response.data.gear,
      };
    } catch (error) {
      return {
        info: { name: 'Kategori Bulunamadı' },
        gear: [],
      };
    }
  },

  async getAllCategorySlugs(): Promise<string[]> {
    const response = await api.get<{ slugs: string[] }>('/categories/slugs');
    return response.data.slugs || [];
  },

  async getAllGear(): Promise<Gear[]> {
    const response = await api.get<{ gear: Gear[] }>('/gear');
    return response.data.gear || response.data as any;
  },

  async getGearById(id: string): Promise<Gear | null> {
    try {
      const response = await api.get<{ gear: Gear }>(`/gear/${id}`);
      return response.data.gear || response.data as any;
    } catch (error) {
      return null;
    }
  },
};
