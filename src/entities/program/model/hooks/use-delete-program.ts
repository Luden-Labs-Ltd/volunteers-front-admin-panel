import { useMutation, useQueryClient } from '@tanstack/react-query';
import { programApi } from '../../api';
import { showToast } from '@/shared/lib/toast';

export function useDeleteProgram() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (id) => programApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['programs'] });
      showToast.success('Программа успешно удалена');
    },
    onError: (error) => {
      const message =
        error instanceof Error
          ? error.message
          : 'Не удалось удалить программу';
      showToast.error(message);
    },
  });
}
