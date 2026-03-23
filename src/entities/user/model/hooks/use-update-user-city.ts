import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '../../api/user-api';

interface UpdateUserCityParams {
  userId: string;
  cityId: string;
}

export function useUpdateUserCity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, cityId }: UpdateUserCityParams) => userApi.update(userId, { cityId }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', variables.userId] });
    },
  });
}

