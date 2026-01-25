import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cityApi } from '@/entities/city';
import type { CreateCityRequest, City } from '@/entities/city';
import { showToast } from '@/shared/lib/toast';

export function useCreateCity() {
  const queryClient = useQueryClient();

  return useMutation<City, Error, CreateCityRequest>({
    mutationFn: (data) => cityApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cities'] });
      showToast.success('Город успешно создан');
    },
    onError: (error: unknown) => {
      let message = 'Не удалось создать город';
      
      if (error instanceof Error) {
        message = error.message;
      } else if (
        typeof error === 'object' &&
        error !== null &&
        'message' in error &&
        typeof (error as { message: unknown }).message === 'string'
      ) {
        message = (error as { message: string }).message;
      }
      
      showToast.error(message);
    },
  });
}
