import { apiClient } from '@/shared/api';
import type {
  User,
  UserWithRoleData,
  CreateUserRequest,
  UpdateUserRequest,
  UserStatus,
} from '../model/types';

export interface GetUsersParams {
  status?: UserStatus;
}

export const userApi = {
  /**
   * Получить список пользователей (использует контроллер `UserController` с путем `/user`).
   * Опционально фильтр по статусу (pending, approved, blocked).
   */
  async getAll(params?: GetUsersParams): Promise<User[]> {
    const url =
      params?.status != null
        ? `/user?status=${encodeURIComponent(params.status)}`
        : '/user';
    return apiClient.request<User[]>(url);
  },

  /**
   * Получить пользователя по ID (с данными роли)
   */
  async getById(id: string): Promise<UserWithRoleData> {
    return apiClient.request<UserWithRoleData>(`/user/${id}`);
  },

  /**
   * Создать пользователя (админский вызов, требует JWT)
   */
  async create(data: CreateUserRequest): Promise<UserWithRoleData> {
    return apiClient.request<UserWithRoleData>('/user', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Обновить пользователя
   */
  async update(id: string, data: UpdateUserRequest): Promise<UserWithRoleData> {
    return apiClient.request<UserWithRoleData>(`/user/${id}`, {
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

