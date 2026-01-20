import { useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryApi } from '../../api';
import type { CreateCategoryRequest, Category } from '../types';
import { showToast } from '@/shared/lib/toast';

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation<Category, Error, CreateCategoryRequest>({
    mutationFn: (data) => categoryApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      showToast.success('Категория успешно создана');
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : 'Не удалось создать категорию';
      showToast.error(message);
    },
  });
}
