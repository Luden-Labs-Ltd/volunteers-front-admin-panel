import { apiClient } from '@/shared/api';
import type {
  Skill,
  CreateSkillRequest,
  UpdateSkillRequest,
  QuerySkillsParams,
} from '../model/types';

export const skillApi = {
  /**
   * Получить список навыков (с фильтрацией по категории)
   */
  getAll: async (params?: QuerySkillsParams): Promise<Skill[]> => {
    const queryParams = new URLSearchParams();
    if (params?.categoryId) {
      queryParams.append('categoryId', params.categoryId);
    }
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/skills?${queryString}` : '/skills';
    return apiClient.request<Skill[]>(endpoint);
  },

  /**
   * Получить навык по ID
   */
  getById: async (id: string): Promise<Skill> => {
    return apiClient.request<Skill>(`/skills/${id}`);
  },

  /**
   * Создать новый навык
   */
  create: async (data: CreateSkillRequest): Promise<Skill> => {
    return apiClient.request<Skill>('/skills', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Обновить навык
   */
  update: async (id: string, data: UpdateSkillRequest): Promise<Skill> => {
    return apiClient.request<Skill>(`/skills/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  /**
   * Удалить навык
   */
  delete: async (id: string): Promise<void> => {
    return apiClient.request<void>(`/skills/${id}`, {
      method: 'DELETE',
    });
  },
};
