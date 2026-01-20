import { apiClient } from '@/shared/api';
import type {
  Task,
  CreateTaskRequest,
  UpdateTaskRequest,
} from '../model/types';

export const taskApi = {
  /**
   * Получить список всех задач
   */
  getAll: async (): Promise<Task[]> => {
    return apiClient.request<Task[]>('/tasks');
  },

  /**
   * Получить задачу по ID
   */
  getById: async (id: string): Promise<Task> => {
    return apiClient.request<Task>(`/tasks/${id}`);
  },

  /**
   * Создать новую задачу (требует Admin роль, JWT токен)
   */
  create: async (data: CreateTaskRequest): Promise<Task> => {
    return apiClient.request<Task>('/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Обновить задачу (требует Admin роль, JWT токен)
   */
  update: async (
    id: string,
    data: UpdateTaskRequest,
  ): Promise<Task> => {
    return apiClient.request<Task>(`/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  /**
   * Удалить задачу (требует Admin роль, JWT токен)
   */
  delete: async (id: string): Promise<void> => {
    return apiClient.request<void>(`/tasks/${id}`, {
      method: 'DELETE',
    });
  },
};
