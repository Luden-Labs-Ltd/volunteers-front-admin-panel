import { apiClient } from '@/shared/api';
import type { City } from '../model/types';

export const cityApi = {
  getAll: async (): Promise<City[]> => {
    return apiClient.request<City[]>('/cities');
  },
  getById: async (id: string): Promise<City> => {
    return apiClient.request<City>(`/cities/${id}`);
  },
};
