import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../api';
import { setToken, setRefreshToken } from '@/shared/lib/auth';
import { toast } from '@/shared/lib/toast';
import type { LoginRequest } from '../types';

export function useAdminLogin() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (response) => {
      setToken(response.accessToken);
      setRefreshToken(response.refreshToken);
      toast.success('Успешный вход в систему');
      navigate('/');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Ошибка при входе в систему');
    },
  });
}
