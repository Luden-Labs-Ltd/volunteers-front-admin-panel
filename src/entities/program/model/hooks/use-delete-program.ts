import { useMutation, useQueryClient } from '@tanstack/react-query';
import { programApi } from '../../api';
import { showToast } from '@/shared/lib/toast';
import { useI18n } from '@/shared/lib/i18n';

export function useDeleteProgram() {
  const queryClient = useQueryClient();
  const { t } = useI18n();
  return useMutation<void, Error, string>({
    mutationFn: (id) => programApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['programs'] });
      showToast.success(t('programs.toast.deleteSuccess'));
    },
    onError: (error) => {
      const message =
        error instanceof Error
          ? error.message
          : t('programs.toast.deleteError');
      showToast.error(message);
    },
  });
}
