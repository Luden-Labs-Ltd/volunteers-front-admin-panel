import { apiClient } from '@/shared/api';
import type { City, CreateCityRequest, UpdateCityRequest } from '../model/types';

export const cityApi = {
  /**
   * Получить список всех городов
   */
  getAll: async (): Promise<City[]> => {
    return apiClient.request<City[]>('/cities');
  },

  /**
   * Получить город по ID
   */
  getById: async (id: string): Promise<City> => {
    return apiClient.request<City>(`/cities/${id}`);
  },

  /**
   * Создать новый город (требует Admin роль, JWT токен)
   */
  create: async (data: CreateCityRequest): Promise<City> => {
    return apiClient.request<City>('/cities', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Обновить город (требует Admin роль, JWT токен)
   */
  update: async (id: string, data: UpdateCityRequest): Promise<City> => {
    return apiClient.request<City>(`/cities/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  /**
   * Удалить город (требует Admin роль, JWT токен)
   */
  delete: async (id: string): Promise<void> => {
    return apiClient.request<void>(`/cities/${id}`, {
      method: 'DELETE',
    });
  },
};
