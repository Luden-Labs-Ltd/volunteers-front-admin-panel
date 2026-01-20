import { useQuery } from '@tanstack/react-query';
import { categoryApi } from '../../api';
import type { Category } from '../types';

export function useCategories() {
  return useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: () => categoryApi.getAll(),
    staleTime: 5 * 60 * 1000, // 5 минут
  });
}
