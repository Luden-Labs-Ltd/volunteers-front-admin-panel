import { useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryApi } from '../../api';
import { showToast } from '@/shared/lib/toast';

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (id) => categoryApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      showToast.success('Категория успешно удалена');
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : 'Не удалось удалить категорию';
      showToast.error(message);
    },
  });
}
