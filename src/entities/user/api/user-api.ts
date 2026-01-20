import { apiClient } from '@/shared/api';
import type {
  User,
  CreateUserRequest,
  UpdateUserRequest,
} from '../model/types';

export const userApi = {
  /**
   * Получить список пользователей (использует контроллер `UserController` с путем `/user`)
   */
  async getAll(): Promise<User[]> {
    return apiClient.request<User[]>('/user');
  },

  /**
   * Получить пользователя по ID
   */
  async getById(id: string): Promise<User> {
    return apiClient.request<User>(`/user/${id}`);
  },

  /**
   * Создать пользователя (админский вызов, требует JWT)
   */
  async create(data: CreateUserRequest): Promise<User> {
    return apiClient.request<User>('/user', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Обновить пользователя
   */
  async update(id: string, data: UpdateUserRequest): Promise<User> {
    return apiClient.request<User>(`/user/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  /**
   * Удалить пользователя
   */
  async delete(id: string): Promise<void> {
    await apiClient.request<void>(`/user/${id}`, {
      method: 'DELETE',
    });
  },
};

