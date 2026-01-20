import { useQuery } from '@tanstack/react-query';
import { authApi } from '../../api';
import { getToken } from '@/shared/lib/auth';
import type { User } from '../types';

export function useGetMe() {
  const token = getToken();

  return useQuery<User>({
    queryKey: ['admin', 'me'],
    queryFn: () => authApi.getMe(),
    enabled: !!token, // Выполнять только если есть токен
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 минут
  });
}
