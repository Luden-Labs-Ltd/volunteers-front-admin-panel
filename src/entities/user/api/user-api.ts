import { apiClient } from '@/shared/api';
import { getToken } from '@/shared/lib/auth';
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

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'https://volunteers-backend-production.up.railway.app';

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

  /**
   * Экспорт пользователей в Excel с теми же фильтрами, что и список в админке.
   * Загружает .xlsx-файл через Blob API.
   */
  async exportUsers(params?: GetUsersPaginatedParams): Promise<void> {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.set('status', params.status);
    if (params?.role) searchParams.set('role', params.role);
    if (params?.search?.trim()) searchParams.set('search', params.search.trim());

    const query = searchParams.toString();
    const url = `${API_BASE_URL}/export/xls/users${query ? `?${query}` : ''}`;

    const rawToken = getToken();
    const token = rawToken?.replace(/^Bearer\s+/i, '');

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to export users: ${response.statusText}`);
    }

    const blob = await response.blob();

    const contentDisposition = response.headers.get('content-disposition');
    let filename = 'users.xlsx';
    if (contentDisposition) {
      const match = /filename="?([^"]+)"?/.exec(contentDisposition);
      if (match && match[1]) {
        filename = match[1];
      }
    }

    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  },
};

