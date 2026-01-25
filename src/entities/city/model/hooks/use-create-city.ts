import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cityApi } from '../../api';
import type { CreateCityRequest, City } from '../types';
import { showToast } from '@/shared/lib/toast';

export function useCreateCity() {
  const queryClient = useQueryClient();

  return useMutation<City, Error, CreateCityRequest>({
    mutationFn: (data) => cityApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cities'] });
      showToast.success('Город успешно создан');
    },
    onError: (error) => {
      let message = 'Не удалось создать город';
      
      if (error instanceof Error) {
        message = error.message;
      } else if (
        typeof error === 'object' &&
        error !== null &&
        'message' in error &&
        typeof error.message === 'string'
      ) {
        message = error.message;
      }
      
      showToast.error(message);
    },
  });
}
