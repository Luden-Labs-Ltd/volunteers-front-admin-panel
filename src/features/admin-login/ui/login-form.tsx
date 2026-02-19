import { FC, useState } from 'react';
import { Button, Input } from '@/shared/ui';
import { useAdminLogin } from '@/entities/auth';
import { useI18n } from '@/shared/lib/i18n';

export const LoginForm: FC = () => {
  const { t } = useI18n();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const loginMutation = useAdminLogin();

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = t('auth.form.emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = t('auth.form.emailInvalid');
    }

    if (!password) {
      newErrors.password = t('auth.form.passwordRequired');
    } else if (password.length < 6) {
      newErrors.password = t('auth.form.passwordMinLength');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    loginMutation.mutate({ email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="email"
        label={t('auth.form.email')}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
        disabled={loginMutation.isPending}
        placeholder={t('auth.form.emailPlaceholder')}
        required
      />

      <Input
        type="password"
        label={t('auth.form.password')}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
        disabled={loginMutation.isPending}
        placeholder={t('auth.form.passwordPlaceholder')}
        required
      />

      <Button
        type="submit"
        variant="primary"
        className="w-full"
        disabled={loginMutation.isPending}
      >
        {loginMutation.isPending ? t('auth.form.loginPending') : t('auth.form.loginButton')}
      </Button>
    </form>
  );
};
