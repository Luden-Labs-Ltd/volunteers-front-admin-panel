import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useI18n } from '@/shared/lib/i18n';
import { showToast } from '@/shared/lib/toast';

import { skillApi } from '../../api';
import type { Skill, UpdateSkillRequest } from '../types';

export function useUpdateSkill() {
  const { t } = useI18n();
  const queryClient = useQueryClient();

  return useMutation<Skill, Error, { id: string; data: UpdateSkillRequest }>({
    mutationFn: ({ id, data }) => skillApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      queryClient.invalidateQueries({ queryKey: ['skill', variables.id] });
      showToast.successKey(t, 'skills.toast.updateSuccess');
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : t('skills.toast.updateError');
      showToast.error(message);
    },
  });
}
