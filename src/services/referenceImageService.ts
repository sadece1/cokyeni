import api from './api';

export interface ReferenceImage {
  id: number;
  title: string;
  location?: string;
  year?: string;
  image_url: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateReferenceImageData {
  title: string;
  location?: string;
  year?: string;
  display_order?: number;
  is_active?: boolean;
  image: File;
}

export interface UpdateReferenceImageData {
  title?: string;
  location?: string;
  year?: string;
  display_order?: number;
  is_active?: boolean;
  image?: File;
}

export const referenceImageService = {
  async getAll(): Promise<ReferenceImage[]> {
    const response = await api.get<{ images: ReferenceImage[] }>('/admin/reference-images');
    return response.data.images || response.data as any;
  },

  async getById(id: number): Promise<ReferenceImage> {
    const response = await api.get<{ image: ReferenceImage }>(`/admin/reference-images/${id}`);
    return response.data.image || response.data as any;
  },

  async create(data: CreateReferenceImageData): Promise<ReferenceImage> {
    const formData = new FormData();
    formData.append('title', data.title);
    if (data.location) formData.append('location', data.location);
    if (data.year) formData.append('year', data.year);
    if (data.display_order !== undefined) formData.append('display_order', data.display_order.toString());
    if (data.is_active !== undefined) formData.append('is_active', data.is_active.toString());
    formData.append('image', data.image);

    const response = await api.post<{ image: ReferenceImage }>('/admin/reference-images', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.image || response.data as any;
  },

  async update(id: number, data: UpdateReferenceImageData): Promise<ReferenceImage> {
    const formData = new FormData();
    if (data.title) formData.append('title', data.title);
    if (data.location) formData.append('location', data.location);
    if (data.year) formData.append('year', data.year);
    if (data.display_order !== undefined) formData.append('display_order', data.display_order.toString());
    if (data.is_active !== undefined) formData.append('is_active', data.is_active.toString());
    if (data.image) formData.append('image', data.image);

    const response = await api.put<{ image: ReferenceImage }>(`/admin/reference-images/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.image || response.data as any;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/admin/reference-images/${id}`);
  },
};
