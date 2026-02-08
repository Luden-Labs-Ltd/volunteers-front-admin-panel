import { useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryApi } from '../../api';
import type { CreateCategoryRequest, Category } from '../types';
import { showToast } from '@/shared/lib/toast';
import { useI18n } from '@/shared/lib/i18n';

export function useCreateCategory() {
  const queryClient = useQueryClient();
  const { t } = useI18n();
  return useMutation<Category, Error, CreateCategoryRequest>({
    mutationFn: (data) => categoryApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      showToast.success(t('categories.toast.createSuccess'));
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : t('categories.toast.createError');
      showToast.error(message);
    },
  });
}
