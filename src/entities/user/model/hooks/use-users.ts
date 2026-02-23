import { useQuery } from '@tanstack/react-query';
import { userApi } from '../../api/user-api';
import type { User, UserStatus } from '../types';

export function useUsers(status?: UserStatus) {
  return useQuery<User[]>({
    queryKey: ['users', status],
    queryFn: () => userApi.getAll(status != null ? { status } : undefined),
    staleTime: 5 * 60 * 1000,
  });
}

