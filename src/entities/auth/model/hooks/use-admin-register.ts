import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../api';
import { setToken, setRefreshToken } from '@/shared/lib/auth';
import { toast } from '@/shared/lib/toast';
import type { RegisterRequest } from '../types';

export function useAdminRegister() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
    onSuccess: (response) => {
      setToken(response.accessToken);
      setRefreshToken(response.refreshToken);
      toast.success('Регистрация успешна');
      navigate('/');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Ошибка при регистрации');
    },
  });
}
