import { useMutation, useQueryClient } from '@tanstack/react-query';
import { programApi } from '../../api';
import type { CreateProgramRequest, Program } from '../types';
import { showToast } from '@/shared/lib/toast';
import { useI18n } from '@/shared/lib/i18n';

export function useCreateProgram() {
  const queryClient = useQueryClient();
  const {t} = useI18n()
  return useMutation<Program, Error, CreateProgramRequest>({
    mutationFn: (data) => programApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['programs'] });
      showToast.success(t('programs.toast.createSuccess'));
    },
    onError: (error) => {
      const message =
        error instanceof Error
          ? error.message
          : t('programs.toast.createError');
      showToast.error(message);
    },
  });
}
