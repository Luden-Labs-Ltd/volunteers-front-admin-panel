import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../api';
import { setToken, setRefreshToken } from '@/shared/lib/auth';
import { useI18n } from '@/shared/lib/i18n';
import { toast } from '@/shared/lib/toast';
import type { LoginRequest } from '../types';

export function useAdminLogin() {
  const navigate = useNavigate();
  const { t } = useI18n();

  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (response) => {
      setToken(response.accessToken);
      setRefreshToken(response.refreshToken);
      toast.success(t('auth.loginSuccess'));
      navigate('/');
    },
    onError: () => {
      toast.error(t('auth.loginError'));
    },
  });
}
