import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../api';
import { clearTokens } from '@/shared/lib/auth';
import { useI18n } from '@/shared/lib/i18n';
import { toast } from '@/shared/lib/toast';

export function useLogout() {
  const navigate = useNavigate();
  const { t } = useI18n();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      clearTokens();
      toast.success(t('auth.logoutSuccess'));
      navigate('/auth');
    },
    onError: () => {
      clearTokens();
      toast.error(t('auth.logoutError'));
      navigate('/auth');
    },
  });
}
