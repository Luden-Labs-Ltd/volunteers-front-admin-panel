import { useQuery } from '@tanstack/react-query';
import { skillApi } from '../../api';
import type { Skill, QuerySkillsParams } from '../types';

export function useSkills(params?: QuerySkillsParams) {
  return useQuery<Skill[]>({
    queryKey: ['skills', params],
    queryFn: () => skillApi.getAll(params),
    staleTime: 5 * 60 * 1000, // 5 минут
  });
}
