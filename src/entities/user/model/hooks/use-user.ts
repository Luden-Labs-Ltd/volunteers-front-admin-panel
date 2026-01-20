import { useQuery } from '@tanstack/react-query';
import { userApi } from '../../api';
import type { User } from '../types';

export function useUser(id: string) {
  return useQuery<User>({
    queryKey: ['user', id],
    queryFn: () => userApi.getById(id),
    enabled: Boolean(id),
    staleTime: 5 * 60 * 1000,
  });
}

