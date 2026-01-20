import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useI18n } from '@/shared/lib/i18n';
import { showToast } from '@/shared/lib/toast';
import { taskApi } from '../../api';

export function useDeleteTask() {
  const { t } = useI18n();
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (id) => taskApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      showToast.successKey(t, 'tasks.toast.deleteSuccess');
    },
    onError: (error) => {
      const message =
        error instanceof Error
          ? error.message
          : t('tasks.toast.deleteError');
      showToast.error(message);
    },
  });
}

