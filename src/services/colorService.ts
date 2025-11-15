import api from './api';

export interface Color {
  id: string;
  name: string;
  hexCode?: string;
  createdAt: string;
  updatedAt: string;
}

export const colorService = {
  async getAllColors(): Promise<Color[]> {
    const response = await api.get<{ colors: Color[] }>('/admin/colors');
    return response.data.colors || response.data as any;
  },

  async getColorById(id: string): Promise<Color | undefined> {
    try {
      const response = await api.get<{ color: Color }>(`/admin/colors/${id}`);
      return response.data.color || response.data as any;
    } catch (error) {
      return undefined;
    }
  },

  async getColorByName(name: string): Promise<Color | undefined> {
    const colors = await this.getAllColors();
    return colors.find(c => c.name.toLowerCase() === name.toLowerCase());
  },

  async createColor(name: string, hexCode?: string): Promise<Color> {
    const response = await api.post<{ color: Color }>('/admin/colors', { name, hexCode });
    return response.data.color || response.data as any;
  },

  async updateColor(id: string, name: string, hexCode?: string): Promise<Color> {
    const response = await api.put<{ color: Color }>(`/admin/colors/${id}`, { name, hexCode });
    return response.data.color || response.data as any;
  },

  async deleteColor(id: string): Promise<void> {
    await api.delete(`/admin/colors/${id}`);
  },
};
