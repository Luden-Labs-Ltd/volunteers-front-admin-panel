import { apiClient } from '@/shared/api';
import type {
  Program,
  CreateProgramRequest,
  UpdateProgramRequest,
} from '../model/types';

export const programApi = {
  /**
   * Получить список всех программ
   */
  getAll: async (): Promise<Program[]> => {
    return apiClient.request<Program[]>('/program');
  },

  /**
   * Получить программу по ID
   */
  getById: async (id: string): Promise<Program> => {
    return apiClient.request<Program>(`/program/${id}`);
  },

  /**
   * Создать новую программу (требует Admin роль, JWT токен)
   */
  create: async (data: CreateProgramRequest): Promise<Program> => {
    return apiClient.request<Program>('/program', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Обновить программу (требует Admin роль, JWT токен)
   */
  update: async (
    id: string,
    data: UpdateProgramRequest,
  ): Promise<Program> => {
    return apiClient.request<Program>(`/program/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  /**
   * Удалить программу (требует Admin роль, JWT токен)
   */
  delete: async (id: string): Promise<void> => {
    return apiClient.request<void>(`/program/${id}`, {
      method: 'DELETE',
    });
  },
};
