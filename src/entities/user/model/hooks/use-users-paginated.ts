import { useQuery } from '@tanstack/react-query';
import { userApi } from '../../api/user-api';
import type { UserStatus, UserRole } from '../types';

export interface UseUsersPaginatedParams {
  status?: UserStatus;
  role?: UserRole;
  page?: number;
  limit?: number;
  search?: string;
}

export function useUsersPaginated(params: UseUsersPaginatedParams = {}) {
  const { page = 1, limit = 10, search, status, role } = params;

  return useQuery({
    queryKey: ['users', 'paginated', { page, limit, search, status, role }],
    queryFn: () =>
      userApi.getAllPaginated({
        page,
        limit,
        search: search?.trim() || undefined,
        status,
        role,
      }),
    staleTime: 2 * 60 * 1000,
  });
}
