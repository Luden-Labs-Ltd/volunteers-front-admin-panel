import { FC, useState } from 'react';
import { Button, Input } from '@/shared/ui';
import { useAdminRegister } from '@/entities/auth';
import { useI18n } from '@/shared/lib/i18n';

export const RegisterForm: FC = () => {
  const { t } = useI18n();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
    firstName?: string;
    lastName?: string;
  }>({});

  const registerMutation = useAdminRegister();

  const validate = () => {
    const newErrors: typeof errors = {};

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

    if (!confirmPassword) {
      newErrors.confirmPassword = t('auth.form.confirmPasswordRequired');
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = t('auth.form.passwordsMismatch');
    }

    if (!firstName) {
      newErrors.firstName = t('auth.form.firstNameRequired');
    }

    if (!lastName) {
      newErrors.lastName = t('auth.form.lastNameRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    registerMutation.mutate({
      email,
      password,
      firstName,
      lastName,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label={t('auth.form.firstName')}
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          error={errors.firstName}
          disabled={registerMutation.isPending}
          placeholder={t('auth.form.firstNamePlaceholder')}
          required
        />

        <Input
          label={t('auth.form.lastName')}
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          error={errors.lastName}
          disabled={registerMutation.isPending}
          placeholder={t('auth.form.lastNamePlaceholder')}
          required
        />
      </div>

      <Input
        type="email"
        label={t('auth.form.email')}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
        disabled={registerMutation.isPending}
        placeholder={t('auth.form.emailPlaceholder')}
        required
      />

      <Input
        type="password"
        label={t('auth.form.password')}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
        disabled={registerMutation.isPending}
        placeholder={t('auth.form.passwordPlaceholder')}
        required
      />

      <Input
        type="password"
        label={t('auth.form.confirmPassword')}
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        error={errors.confirmPassword}
        disabled={registerMutation.isPending}
        placeholder={t('auth.form.passwordPlaceholder')}
        required
      />

      <Button
        type="submit"
        variant="primary"
        className="w-full"
        disabled={registerMutation.isPending}
      >
        {registerMutation.isPending ? t('auth.form.registerPending') : t('auth.form.registerButton')}
      </Button>
    </form>
  );
};
