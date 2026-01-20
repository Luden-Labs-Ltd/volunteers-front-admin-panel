import { useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryApi } from '../../api';
import type { UpdateCategoryRequest, Category } from '../types';
import { showToast } from '@/shared/lib/toast';

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation<
    Category,
    Error,
    { id: string; data: UpdateCategoryRequest }
  >({
    mutationFn: ({ id, data }) => categoryApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['category', variables.id] });
      showToast.success('Категория успешно обновлена');
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : 'Не удалось обновить категорию';
      showToast.error(message);
    },
  });
}
