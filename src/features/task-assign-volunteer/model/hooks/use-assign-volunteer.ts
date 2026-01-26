import { useMutation, useQueryClient } from '@tanstack/react-query';
import { taskApi } from '@/entities/task';
import { showToast } from '@/shared/lib/toast';
import { useI18n } from '@/shared/lib/i18n';
import type { AssignVolunteerRequest } from '@/entities/task';

export function useAssignVolunteer() {
  const queryClient = useQueryClient();
  const { t } = useI18n();

  return useMutation({
    mutationFn: ({ taskId, volunteerId }: { taskId: string; volunteerId: string }) =>
      taskApi.assignVolunteer(taskId, { volunteerId } satisfies AssignVolunteerRequest),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      showToast.successKey(t, 'tasks.toast.assignSuccess');
    },
    onError: (error: Error | unknown) => {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        t('tasks.toast.assignError') ||
        'Ошибка при назначении волонтера';
      showToast.error(message);
    },
  });
}
