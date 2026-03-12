import { apiClient } from '@/shared/api';
import type {
  User,
  UserWithRoleData,
  CreateUserRequest,
  UpdateUserRequest,
  UserStatus,
  UserRole,
} from '../model/types';

export interface GetUsersParams {
  status?: UserStatus;
}

export interface GetUsersPaginatedParams {
  status?: UserStatus;
  role?: UserRole;
  page?: number;
  limit?: number;
  search?: string;
}

export interface PaginatedUsersResponse {
  items: User[];
  total: number;
  page: number;
  limit: number;
}

export const userApi = {
  /**
   * Получить список пользователей без пагинации (для мобилки, create-task и т.д.).
   */
  async getAll(params?: GetUsersParams): Promise<User[]> {
    const url =
      params?.status != null
        ? `/user?status=${encodeURIComponent(params.status)}`
        : '/user';
    return apiClient.request<User[]>(url);
  },

  /**
   * Получить пользователей с пагинацией и поиском (для админ-панели).
   * Использует отдельный эндпоинт GET /user/admin.
   */
  async getAllPaginated(params?: GetUsersPaginatedParams): Promise<PaginatedUsersResponse> {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.set('status', params.status);
    if (params?.role) searchParams.set('role', params.role);
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.limit) searchParams.set('limit', String(params.limit));
    if (params?.search?.trim()) searchParams.set('search', params.search.trim());
    const query = searchParams.toString();
    const url = query ? `/user/admin?${query}` : '/user/admin';
    return apiClient.request<PaginatedUsersResponse>(url);
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

