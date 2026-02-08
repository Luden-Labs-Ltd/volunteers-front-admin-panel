import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { programApi } from '../../api';
import type { User } from '@/entities/user';

export function useProgramVolunteers(
  programId: string,
  options?: Omit<UseQueryOptions<User[], Error>, 'queryKey' | 'queryFn' | 'enabled'>,
) {
  const isEnabled = options?.enabled !== false && !!programId;
  
  // Исключаем enabled из options, чтобы избежать дублирования
  const { enabled: _, ...restOptions } = options || {};
  
  return useQuery<User[]>({
    queryKey: ['program', programId, 'volunteers'],
    queryFn: () => programApi.getVolunteers(programId),
    enabled: isEnabled,
    staleTime: 5 * 60 * 1000, // 5 минут - данные считаются свежими
    gcTime: 10 * 60 * 1000, // 10 минут - время жизни кеша
    refetchOnMount: false, // Не делать запрос при монтировании, если данные свежие
    refetchOnWindowFocus: false, // Не делать запрос при фокусе окна
    refetchOnReconnect: false, // Не делать запрос при переподключении
    ...restOptions,
  });
}
