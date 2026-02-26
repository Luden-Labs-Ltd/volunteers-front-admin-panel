import { FC } from 'react';
import { useAdminLogin } from '@/entities/auth';
import { FormField, getDisplayErrorMessage, useZodForm } from '@/shared/form';
import { useI18n } from '@/shared/lib/i18n';
import { Button, Input } from '@/shared/ui';
import { z } from 'zod';

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: 'auth.form.emailRequired' })
    .refine((v: string) => /\S+@\S+\.\S+/.test(v), { message: 'auth.form.emailInvalid' }),
  password: z
    .string()
    .min(1, { message: 'auth.form.passwordRequired' })
    .refine((v: string) => v.length >= 6, { message: 'auth.form.passwordMinLength' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginForm: FC = () => {
  const { t } = useI18n();
  const form = useZodForm<LoginFormValues>({
    schema: loginSchema,
    defaultValues: { email: '', password: '' },
  });
  const loginMutation = useAdminLogin();

  const onSubmit = form.handleSubmit((data) => {
    loginMutation.mutate({ email: data.email, password: data.password });
  });

  const err = form.formState.errors;

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <FormField
        labelKey="auth.form.email"
        name="email"
        isRequired
        error={getDisplayErrorMessage(err.email?.message, t)}
      >
        <Input
          id="email"
          type="email"
          {...form.register('email')}
          disabled={loginMutation.isPending}
          placeholder={t('auth.form.emailPlaceholder')}
        />
      </FormField>

      <FormField
        labelKey="auth.form.password"
        name="password"
        isRequired
        error={getDisplayErrorMessage(err.password?.message, t)}
      >
        <Input
          id="password"
          type="password"
          {...form.register('password')}
          disabled={loginMutation.isPending}
          placeholder={t('auth.form.passwordPlaceholder')}
        />
      </FormField>

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
