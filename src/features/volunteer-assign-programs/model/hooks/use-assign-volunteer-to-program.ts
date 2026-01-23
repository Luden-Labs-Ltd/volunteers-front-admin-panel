import { useMutation, useQueryClient } from '@tanstack/react-query';
import { programApi } from '@/entities/program';
import { showToast } from '@/shared/lib/toast';
import { useI18n } from '@/shared/lib/i18n';

export function useAssignVolunteerToProgram() {
  const queryClient = useQueryClient();
  const { t } = useI18n();

  return useMutation({
    mutationFn: ({
      programId,
      volunteerId,
    }: {
      programId: string;
      volunteerId: string;
    }) => programApi.assignVolunteerToProgram(programId, volunteerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['programs'] });
      queryClient.invalidateQueries({ queryKey: ['program'] });
      showToast.successKey(t, 'users.programsAssigned');
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        t('users.programsError') ||
        'Ошибка при назначении программы';
      showToast.error(message);
    },
  });
}
