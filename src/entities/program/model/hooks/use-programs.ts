import { useQuery } from '@tanstack/react-query';
import { programApi } from '../../api';
import type { Program } from '../types';

export function usePrograms() {
  return useQuery<Program[]>({
    queryKey: ['programs'],
    queryFn: () => programApi.getAll(),
    staleTime: 5 * 60 * 1000, // 5 минут
  });
}
