import api from './api';
import { BlogPost, BlogFilters, PaginatedResponse } from '@/types';

export const blogService = {
  async getBlogs(
    filters?: BlogFilters,
    page: number = 1
  ): Promise<PaginatedResponse<BlogPost>> {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (filters?.search) params.append('search', filters.search);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.tag) params.append('tag', filters.tag);
    if (filters?.featured) params.append('featured', 'true');

    const response = await api.get(`/blogs?${params.toString()}`);
    return response.data;
  },

  async getBlogById(id: string): Promise<BlogPost> {
    const response = await api.get(`/blogs/${id}`);
    return response.data.blog || response.data;
  },

  async createBlog(blog: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>): Promise<BlogPost> {
    const response = await api.post('/blogs', blog);
    return response.data.blog || response.data;
  },

  async updateBlog(id: string, blog: Partial<BlogPost>): Promise<BlogPost> {
    const response = await api.put(`/blogs/${id}`, blog);
    return response.data.blog || response.data;
  },

  async deleteBlog(id: string): Promise<void> {
    await api.delete(`/blogs/${id}`);
  },
};
