import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useI18n } from '@/shared/lib/i18n';
import { showToast } from '@/shared/lib/toast';

import { skillApi } from '../../api';

export function useDeleteSkill() {
  const { t } = useI18n();
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (id) => skillApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      showToast.successKey(t, 'skills.toast.deleteSuccess');
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : t('skills.toast.deleteError');
      showToast.error(message);
    },
  });
}
