import { useQuery } from '@tanstack/react-query';
import { programApi } from '../../api';
import type { User } from '@/entities/user';

export function useProgramVolunteers(programId: string) {
  return useQuery<User[]>({
    queryKey: ['program', programId, 'volunteers'],
    queryFn: () => programApi.getVolunteers(programId),
    enabled: !!programId,
    staleTime: 5 * 60 * 1000, // 5 минут
  });
}
