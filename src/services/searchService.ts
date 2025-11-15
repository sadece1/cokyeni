import api from './api';
import { Gear } from '@/types';

export interface SearchResult {
  blogs: Array<{
    id: string;
    title: string;
    excerpt: string;
    image: string;
    category: string;
  }>;
  gear: Gear[];
}

export const searchService = {
  async search(query: string): Promise<SearchResult> {
    try {
      const response = await api.get<SearchResult>('/search', {
        params: { q: query },
      });
      return response.data;
    } catch (error) {
      return { blogs: [], gear: [] };
    }
  },
};
