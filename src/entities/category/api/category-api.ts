import { apiClient } from '@/shared/api';
import type {
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from '../model/types';

export const categoryApi = {
  /**
   * Получить список всех категорий
   */
  getAll: async (): Promise<Category[]> => {
    return apiClient.request<Category[]>('/categories');
  },

  /**
   * Получить категорию по ID
   */
  getById: async (id: string): Promise<Category> => {
    return apiClient.request<Category>(`/categories/${id}`);
  },

  /**
   * Создать новую категорию
   */
  create: async (data: CreateCategoryRequest): Promise<Category> => {
    return apiClient.request<Category>('/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Обновить категорию
   */
  update: async (
    id: string,
    data: UpdateCategoryRequest,
  ): Promise<Category> => {
    return apiClient.request<Category>(`/categories/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  /**
   * Удалить категорию
   */
  delete: async (id: string): Promise<void> => {
    return apiClient.request<void>(`/categories/${id}`, {
      method: 'DELETE',
    });
  },
};
