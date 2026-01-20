import { useMutation, useQueryClient } from '@tanstack/react-query';
import { programApi } from '../../api';
import type { UpdateProgramRequest, Program } from '../types';
import { showToast } from '@/shared/lib/toast';

export function useUpdateProgram() {
  const queryClient = useQueryClient();

  return useMutation<
    Program,
    Error,
    { id: string; data: UpdateProgramRequest }
  >({
    mutationFn: ({ id, data }) => programApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['programs'] });
      queryClient.invalidateQueries({ queryKey: ['program', variables.id] });
      showToast.success('Программа успешно обновлена');
    },
    onError: (error) => {
      const message =
        error instanceof Error
          ? error.message
          : 'Не удалось обновить программу';
      showToast.error(message);
    },
  });
}
