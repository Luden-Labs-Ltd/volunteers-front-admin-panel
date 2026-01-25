import { apiClient } from '@/shared/api';
import { getToken } from '@/shared/lib/auth';
import type { Image, UpdateImageRequest } from '../model/types';

export const imageApi = {
  /**
   * Загрузить изображение
   */
  upload: async (file: File, folder?: string): Promise<Image> => {
    const formData = new FormData();
    formData.append('file', file);
    if (folder) {
      formData.append('folder', folder);
    }

    // Используем fetch напрямую для multipart/form-data
    const token = getToken();
    const baseUrl = import.meta.env.VITE_API_URL || 'https://volunteers-backend-production.up.railway.app';
    
    const response = await fetch(`${baseUrl}/image`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `API Error: ${response.statusText}`;
      
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || errorMessage;
      } catch {
        if (errorText) {
          errorMessage = errorText;
        }
      }

      const error = new Error(errorMessage) as Error & { status?: number };
      error.status = response.status;
      throw error;
    }

    return response.json();
  },

  /**
   * Получить список всех изображений
   */
  getAll: async (): Promise<Image[]> => {
    return apiClient.request<Image[]>('/image');
  },

  /**
   * Получить изображение по ID
   */
  getById: async (id: string): Promise<Image> => {
    return apiClient.request<Image>(`/image/${id}`);
  },

  /**
   * Получить signed URL для изображения
   */
  getSignedUrl: async (id: string, expiresIn?: number): Promise<string> => {
    const query = expiresIn ? `?expiresIn=${expiresIn}` : '';
    const response = await apiClient.request<{ url: string }>(`/image/${id}/url${query}`);
    return response.url;
  },

  /**
   * Обновить метаданные изображения
   */
  update: async (id: string, data: UpdateImageRequest): Promise<Image> => {
    return apiClient.request<Image>(`/image/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  /**
   * Удалить изображение
   */
  delete: async (id: string): Promise<void> => {
    return apiClient.request<void>(`/image/${id}`, {
      method: 'DELETE',
    });
  },
};
