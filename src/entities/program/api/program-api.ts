import { apiClient } from '@/shared/api';
import type {
  Program,
  CreateProgramRequest,
  UpdateProgramRequest,
} from '../model/types';
import type { User } from '@/entities/user';

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

  /**
   * Получить список волонтеров программы (требует Admin или Needy роль, JWT токен)
   */
  getVolunteers: async (programId: string): Promise<User[]> => {
    return apiClient.request<User[]>(`/program/${programId}/volunteers`);
  },

  /**
   * Назначить волонтера на программу (требует Admin роль, JWT токен)
   */
  assignVolunteerToProgram: async (
    programId: string,
    volunteerId: string,
  ): Promise<{ success: boolean; message: string }> => {
    return apiClient.request<{ success: boolean; message: string }>(
      `/program/${programId}/assign-volunteer/${volunteerId}`,
      {
        method: 'POST',
      },
    );
  },
};
