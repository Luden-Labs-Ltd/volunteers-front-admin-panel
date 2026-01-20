import { useQuery } from '@tanstack/react-query';
import { taskApi } from '../../api';
import type { Task } from '../types';

export function useTask(id: string) {
  return useQuery<Task>({
    queryKey: ['task', id],
    queryFn: () => taskApi.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 минут
  });
}
