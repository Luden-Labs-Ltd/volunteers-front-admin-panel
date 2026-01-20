import { useMutation, useQueryClient } from '@tanstack/react-query';
import { programApi } from '../../api';
import type { CreateProgramRequest, Program } from '../types';
import { showToast } from '@/shared/lib/toast';

export function useCreateProgram() {
  const queryClient = useQueryClient();

  return useMutation<Program, Error, CreateProgramRequest>({
    mutationFn: (data) => programApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['programs'] });
      showToast.success('Программа успешно создана');
    },
    onError: (error) => {
      const message =
        error instanceof Error
          ? error.message
          : 'Не удалось создать программу';
      showToast.error(message);
    },
  });
}
