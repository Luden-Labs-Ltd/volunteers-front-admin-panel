import { getToken, setToken, getRefreshToken, setRefreshToken, clearTokens } from '@/shared/lib/auth';

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://volunteers-backend-production.up.railway.app";

export class ApiClient {
  private baseUrl: string;
  private isRefreshing = false;
  private refreshPromise: Promise<void> | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async refreshTokens(): Promise<void> {
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise;
    }

    this.isRefreshing = true;
    this.refreshPromise = (async () => {
      try {
        let accessToken = getToken();
        let refreshToken = getRefreshToken();

        if (!accessToken || !refreshToken) {
          throw new Error('No tokens available');
        }

        // Убираем префикс "Bearer " если он есть (токены должны храниться без префикса)
        accessToken = accessToken.replace(/^Bearer\s+/i, '');
        refreshToken = refreshToken.replace(/^Bearer\s+/i, '');

        const response = await fetch(`${this.baseUrl}/auth/admin/refresh`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            accessToken,
            refreshToken,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          let errorMessage = 'Failed to refresh tokens';
          
          try {
            const errorData = JSON.parse(errorText);
            errorMessage = errorData.message || errorMessage;
          } catch {
            if (errorText) {
              errorMessage = errorText;
            }
          }

          // Логируем ошибку для отладки
          if (import.meta.env.DEV) {
            console.error('❌ Refresh token failed:', {
              status: response.status,
              statusText: response.statusText,
              message: errorMessage,
            });
          }

          throw new Error(errorMessage);
        }

        const data = await response.json();
        
        if (!data.accessToken || !data.refreshToken) {
          throw new Error('Invalid response: missing tokens');
        }

        setToken(data.accessToken);
        setRefreshToken(data.refreshToken);

        if (import.meta.env.DEV) {
          console.log('✓ Tokens refreshed successfully');
        }
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error('❌ Refresh token error:', error);
        }
        clearTokens();
        // Перенаправление на страницу авторизации
        if (typeof window !== 'undefined') {
          window.location.href = '/auth';
        }
        throw error;
      } finally {
        this.isRefreshing = false;
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const token = getToken();
    
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options?.headers as Record<string, string>),
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    let response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    // Обработка 401 ошибки - попытка обновить токены
    if (response.status === 401 && token) {
      // Проверяем, что это не запрос на refresh токен (чтобы избежать бесконечного цикла)
      if (endpoint !== '/auth/admin/refresh') {
        try {
          await this.refreshTokens();
          
          // Повторяем запрос с новым токеном
          const newToken = getToken();
          if (newToken) {
            headers.Authorization = `Bearer ${newToken}`;
          }

          response = await fetch(`${this.baseUrl}${endpoint}`, {
            ...options,
            headers,
          });
        } catch (error) {
          // Если refresh не удался, токены уже очищены и произошел редирект
          throw error;
        }
      }
    }

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `API Error: ${response.statusText}`;
      
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || errorMessage;
      } catch {
        // Если не удалось распарсить JSON, используем текст ошибки
        if (errorText) {
          errorMessage = errorText;
        }
      }

      const error = new Error(errorMessage) as Error & { status?: number; response?: Response };
      error.status = response.status;
      error.response = response;
      throw error;
    }

    // Проверяем, есть ли контент в ответе (для DELETE и других запросов с пустым телом)
    // const contentType = response.headers.get('content-type');
    const contentLength = response.headers.get('content-length');
    
    // Если ответ 204 No Content, возвращаем undefined (нет тела)
    if (response.status === 204) {
      return undefined as T;
    }

    // Если content-length явно 0, возвращаем undefined
    if (contentLength === '0') {
      return undefined as T;
    }

    // Получаем текст ответа для проверки
    const text = await response.text();
    
    // Если текст пустой, возвращаем undefined
    if (!text || text.trim() === '') {
      return undefined as T;
    }

    // Пытаемся распарсить JSON
    try {
      return JSON.parse(text) as T;
    } catch (parseError) {
      // Если не удалось распарсить JSON (например, невалидный JSON или не JSON контент)
      // Для void типов возвращаем undefined, для остальных - пробрасываем ошибку
      // Но обычно если это не JSON, то это ошибка, так что пробрасываем
      throw new Error(`Failed to parse JSON response: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`);
    }
  }
}

export const apiClient = new ApiClient();
