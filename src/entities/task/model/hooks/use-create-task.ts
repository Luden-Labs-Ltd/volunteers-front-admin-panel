import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useI18n } from '@/shared/lib/i18n';
import { showToast } from '@/shared/lib/toast';
import { taskApi } from '../../api';
import type { CreateTaskRequest, Task } from '../types';

export function useCreateTask() {
  const { t } = useI18n();
  const queryClient = useQueryClient();

  return useMutation<Task, Error, CreateTaskRequest>({
    mutationFn: (data) => taskApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      showToast.successKey(t, 'tasks.toast.createSuccess');
    },
    onError: (error) => {
      const message =
        error instanceof Error
          ? error.message
          : t('tasks.toast.createError');
      showToast.error(message);
    },
  });
}

