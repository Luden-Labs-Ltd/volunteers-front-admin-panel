import { useQuery } from '@tanstack/react-query';
import { userApi } from '../../api/user-api';
import type { User } from '../types';

export function useUsers() {
  return useQuery<User[]>({
    queryKey: ['users'],
    queryFn: () => userApi.getAll(),
    staleTime: 5 * 60 * 1000,
  });
}

