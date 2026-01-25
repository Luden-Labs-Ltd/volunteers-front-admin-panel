import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '../../api/user-api';
import type { UserStatus } from '../types';

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, status }: { userId: string; status: UserStatus }) =>
      userApi.update(userId, { status }),
    onSuccess: () => {
      // Инвалидируем кеш пользователей
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
}
