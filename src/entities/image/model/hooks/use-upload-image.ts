import { useMutation } from '@tanstack/react-query';
import { imageApi } from '../../api/image-api';
import type { Image } from '../types';
import { showToast } from '@/shared/lib/toast';

export interface UploadImageParams {
  file: File;
  folder?: string;
}

export function useUploadImage() {
  return useMutation<Image, Error, UploadImageParams>({
    mutationFn: ({ file, folder }) => imageApi.upload(file, folder),
    onSuccess: () => {
      showToast.success('Изображение успешно загружено');
    },
    onError: (error: unknown) => {
      let message = 'Не удалось загрузить изображение';
      
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
