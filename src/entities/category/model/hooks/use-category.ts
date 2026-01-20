import { useQuery } from '@tanstack/react-query';
import { categoryApi } from '../../api';
import type { Category } from '../types';

export function useCategory(id: string) {
  return useQuery<Category>({
    queryKey: ['category', id],
    queryFn: () => categoryApi.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 минут
  });
}
