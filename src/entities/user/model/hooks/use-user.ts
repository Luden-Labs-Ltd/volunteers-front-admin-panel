import { useQuery } from '@tanstack/react-query';
import { userApi } from '../../api';
import type { UserWithRoleData } from '../types';

export function useUser(id: string) {
  return useQuery<UserWithRoleData>({
    queryKey: ['user', id],
    queryFn: () => userApi.getById(id),
    enabled: Boolean(id),
    staleTime: 5 * 60 * 1000,
  });
}

