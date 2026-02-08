import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cityApi } from '@/entities/city';
import type { CreateCityRequest, City } from '@/entities/city';
import { showToast } from '@/shared/lib/toast';
import { useI18n } from '@/shared/lib/i18n';

export function useCreateCity() {
  const queryClient = useQueryClient();
  const {t} = useI18n()
  return useMutation<City, Error, CreateCityRequest>({
    mutationFn: (data) => cityApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cities'] });
      showToast.success(t('cities.toast.createSuccess'));
    },
    onError: () => {
      showToast.error(t('cities.toast.createError'));
    },
  });
}
