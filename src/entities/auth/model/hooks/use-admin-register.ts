import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../api';
import { setToken, setRefreshToken } from '@/shared/lib/auth';
import { useI18n } from '@/shared/lib/i18n';
import { toast } from '@/shared/lib/toast';
import type { RegisterRequest } from '../types';

export function useAdminRegister() {
  const navigate = useNavigate();
  const { t } = useI18n();

  return useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
    onSuccess: (response) => {
      setToken(response.accessToken);
      setRefreshToken(response.refreshToken);
      toast.success(t('auth.registerSuccess'));
      navigate('/');
    },
    onError: () => {
      toast.error(t('auth.registerError'));
    },
  });
}
