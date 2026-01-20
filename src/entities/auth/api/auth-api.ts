import { apiClient } from '@/shared/api';
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  RefreshTokensRequest,
  RefreshTokensResponse,
  User,
} from '../model/types';

export const authApi = {
  // Регистрация админа
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    return apiClient.request<AuthResponse>('/auth/admin/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Авторизация админа
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    return apiClient.request<AuthResponse>('/auth/admin/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Обновление токенов
  refreshTokens: async (
    data: RefreshTokensRequest
  ): Promise<RefreshTokensResponse> => {
    return apiClient.request<RefreshTokensResponse>('/auth/admin/refresh', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Выход из системы
  logout: async (): Promise<{ message: string }> => {
    return apiClient.request<{ message: string }>('/auth/admin/logout', {
      method: 'POST',
    });
  },

  // Получение данных текущего пользователя
  // Используем общий endpoint /auth/user/me, который работает для всех ролей
  getMe: async (): Promise<User> => {
    return apiClient.request<User>('/auth/user/me');
  },
};
