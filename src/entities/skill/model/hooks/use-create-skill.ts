import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useI18n } from '@/shared/lib/i18n';
import { showToast } from '@/shared/lib/toast';

import { skillApi } from '../../api';
import type { CreateSkillRequest, Skill } from '../types';

export function useCreateSkill() {
  const { t } = useI18n();
  const queryClient = useQueryClient();

  return useMutation<Skill, Error, CreateSkillRequest>({
    mutationFn: (data) => skillApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      showToast.successKey(t, 'skills.toast.createSuccess');
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : t('skills.toast.createError');
      showToast.error(message);
    },
  });
}
