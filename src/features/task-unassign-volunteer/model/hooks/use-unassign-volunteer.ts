import { useMutation, useQueryClient } from '@tanstack/react-query';
import { taskApi } from '@/entities/task';
import { showToast } from '@/shared/lib/toast';
import { useI18n } from '@/shared/lib/i18n';

export function useUnassignVolunteer() {
  const queryClient = useQueryClient();
  const { t } = useI18n();

  return useMutation({
    mutationFn: (taskId: string) => taskApi.cancelAssignment(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      showToast.successKey(t, 'tasks.toast.unassignSuccess');
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        t('tasks.toast.unassignError') ||
        'Ошибка при отмене назначения';
      showToast.error(message);
    },
  });
}
