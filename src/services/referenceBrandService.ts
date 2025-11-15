import api from './api';

export interface ReferenceBrand {
  id: number;
  name: string;
  description?: string;
  logo_url: string;
  website_url?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateReferenceBrandData {
  name: string;
  description?: string;
  website_url?: string;
  display_order?: number;
  is_active?: boolean;
  logo: File;
}

export interface UpdateReferenceBrandData {
  name?: string;
  description?: string;
  website_url?: string;
  display_order?: number;
  is_active?: boolean;
  logo?: File;
}

export const referenceBrandService = {
  async getAll(): Promise<ReferenceBrand[]> {
    const response = await api.get<{ brands: ReferenceBrand[] }>('/reference-brands');
    return response.data.brands || response.data as any;
  },

  async getById(id: number): Promise<ReferenceBrand> {
    const response = await api.get<{ brand: ReferenceBrand }>(`/reference-brands/${id}`);
    return response.data.brand || response.data as any;
  },

  async create(data: CreateReferenceBrandData): Promise<ReferenceBrand> {
    const formData = new FormData();
    formData.append('name', data.name);
    if (data.description) formData.append('description', data.description);
    if (data.website_url) formData.append('website_url', data.website_url);
    if (data.display_order !== undefined) formData.append('display_order', data.display_order.toString());
    if (data.is_active !== undefined) formData.append('is_active', data.is_active.toString());
    formData.append('logo', data.logo);

    const response = await api.post<{ brand: ReferenceBrand }>('/reference-brands', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.brand || response.data as any;
  },

  async update(id: number, data: UpdateReferenceBrandData): Promise<ReferenceBrand> {
    const formData = new FormData();
    if (data.name) formData.append('name', data.name);
    if (data.description) formData.append('description', data.description);
    if (data.website_url) formData.append('website_url', data.website_url);
    if (data.display_order !== undefined) formData.append('display_order', data.display_order.toString());
    if (data.is_active !== undefined) formData.append('is_active', data.is_active.toString());
    if (data.logo) formData.append('logo', data.logo);

    const response = await api.put<{ brand: ReferenceBrand }>(`/reference-brands/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.brand || response.data as any;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/reference-brands/${id}`);
  },
};
