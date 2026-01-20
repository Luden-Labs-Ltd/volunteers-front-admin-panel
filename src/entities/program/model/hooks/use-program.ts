import { useQuery } from '@tanstack/react-query';
import { programApi } from '../../api';
import type { Program } from '../types';

export function useProgram(id: string) {
  return useQuery<Program>({
    queryKey: ['program', id],
    queryFn: () => programApi.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 минут
  });
}
