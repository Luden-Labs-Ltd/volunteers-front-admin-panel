import { useQuery } from '@tanstack/react-query';
import { skillApi } from '../../api';
import type { Skill } from '../types';

export function useSkill(id: string) {
  return useQuery<Skill>({
    queryKey: ['skill', id],
    queryFn: () => skillApi.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 минут
  });
}
