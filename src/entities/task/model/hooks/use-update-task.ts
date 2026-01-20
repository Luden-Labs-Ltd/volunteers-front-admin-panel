import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useI18n } from '@/shared/lib/i18n';
import { showToast } from '@/shared/lib/toast';
import { taskApi } from '../../api';
import type { Task, UpdateTaskRequest } from '../types';

interface UpdateTaskVariables {
  id: string;
  data: UpdateTaskRequest;
}

export function useUpdateTask() {
  const { t } = useI18n();
  const queryClient = useQueryClient();

  return useMutation<Task, Error, UpdateTaskVariables>({
    mutationFn: ({ id, data }) => taskApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['task', variables.id] });
      showToast.successKey(t, 'tasks.toast.updateSuccess');
    },
    onError: (error) => {
      const message =
        error instanceof Error
          ? error.message
          : t('tasks.toast.updateError');
      showToast.error(message);
    },
  });
}

