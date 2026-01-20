import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../api';
import { clearTokens } from '@/shared/lib/auth';
import { toast } from '@/shared/lib/toast';

export function useLogout() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      clearTokens();
      toast.success('Вы успешно вышли из системы');
      navigate('/auth');
    },
    onError: (error: Error) => {
      // Даже если запрос не удался, очищаем токены локально
      clearTokens();
      toast.error(error.message || 'Ошибка при выходе');
      navigate('/auth');
    },
  });
}
