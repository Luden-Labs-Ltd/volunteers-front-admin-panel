import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '@/entities/user';
import type { CreateUserRequest } from '@/entities/user';
import { toast } from 'sonner';
import { useI18n } from '@/shared/lib/i18n';

export function useCreateNeedy() {
  const queryClient = useQueryClient();
  const { t } = useI18n();

  return useMutation({
    mutationFn: async (data: CreateUserRequest) => {
      return userApi.create({
        ...data,
        role: 'needy',
        status: 'approved',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success(t('needy.form.createSuccess') || 'Нуждающийся успешно создан');
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        t('needy.form.createError') ||
        'Ошибка при создании нуждающегося';
      toast.error(message);
    },
  });
}
