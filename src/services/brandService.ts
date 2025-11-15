import api from './api';

export interface Brand {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export const brandService = {
  async getAllBrands(): Promise<Brand[]> {
    const response = await api.get<{ brands: Brand[] }>('/admin/brands');
    return response.data.brands || response.data as any;
  },

  async getBrandById(id: string): Promise<Brand | undefined> {
    try {
      const response = await api.get<{ brand: Brand }>(`/admin/brands/${id}`);
      return response.data.brand || response.data as any;
    } catch (error) {
      return undefined;
    }
  },

  async getBrandByName(name: string): Promise<Brand | undefined> {
    const brands = await this.getAllBrands();
    return brands.find(b => b.name.toLowerCase() === name.toLowerCase());
  },

  async createBrand(name: string): Promise<Brand> {
    const response = await api.post<{ brand: Brand }>('/admin/brands', { name });
    return response.data.brand || response.data as any;
  },

  async updateBrand(id: string, name: string): Promise<Brand> {
    const response = await api.put<{ brand: Brand }>(`/admin/brands/${id}`, { name });
    return response.data.brand || response.data as any;
  },

  async deleteBrand(id: string): Promise<void> {
    await api.delete(`/admin/brands/${id}`);
  },
};
