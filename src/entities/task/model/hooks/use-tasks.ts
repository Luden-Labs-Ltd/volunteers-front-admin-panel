import { useQuery } from '@tanstack/react-query';
import { taskApi } from '../../api';
import type { Task } from '../types';

export function useTasks() {
  return useQuery<Task[]>({
    queryKey: ['tasks'],
    queryFn: () => taskApi.getAll(),
    staleTime: 5 * 60 * 1000, // 5 минут
  });
}
