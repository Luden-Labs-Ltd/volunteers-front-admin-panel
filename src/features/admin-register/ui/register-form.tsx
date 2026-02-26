import { FC } from 'react';
import { useAdminRegister } from '@/entities/auth';
import { FormField, getDisplayErrorMessage, useZodForm } from '@/shared/form';
import { useI18n } from '@/shared/lib/i18n';
import { Button, Input } from '@/shared/ui';
import { z } from 'zod';

const registerSchema = z
  .object({
    email: z
      .string()
      .trim()
      .min(1, { message: 'auth.form.emailRequired' })
      .refine((v: string) => /\S+@\S+\.\S+/.test(v), { message: 'auth.form.emailInvalid' }),
    password: z
      .string()
      .min(1, { message: 'auth.form.passwordRequired' })
      .refine((v: string) => v.length >= 6, { message: 'auth.form.passwordMinLength' }),
    confirmPassword: z.string().min(1, { message: 'auth.form.confirmPasswordRequired' }),
    firstName: z.string().trim().min(1, { message: 'auth.form.firstNameRequired' }),
    lastName: z.string().trim().min(1, { message: 'auth.form.lastNameRequired' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'auth.form.passwordsMismatch',
    path: ['confirmPassword'],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export const RegisterForm: FC = () => {
  const { t } = useI18n();
  const form = useZodForm<RegisterFormValues>({
    schema: registerSchema,
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
    },
  });
  const registerMutation = useAdminRegister();

  const onSubmit = form.handleSubmit((data) => {
    registerMutation.mutate({
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
    });
  });

  const err = form.formState.errors;

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <FormField
          labelKey="auth.form.firstName"
          name="firstName"
          isRequired
          error={getDisplayErrorMessage(err.firstName?.message, t)}
        >
          <Input
            id="firstName"
            {...form.register('firstName')}
            disabled={registerMutation.isPending}
            placeholder={t('auth.form.firstNamePlaceholder')}
          />
        </FormField>

        <FormField
          labelKey="auth.form.lastName"
          name="lastName"
          isRequired
          error={getDisplayErrorMessage(err.lastName?.message, t)}
        >
          <Input
            id="lastName"
            {...form.register('lastName')}
            disabled={registerMutation.isPending}
            placeholder={t('auth.form.lastNamePlaceholder')}
          />
        </FormField>
      </div>

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
          disabled={registerMutation.isPending}
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
          disabled={registerMutation.isPending}
          placeholder={t('auth.form.passwordPlaceholder')}
        />
      </FormField>

      <FormField
        labelKey="auth.form.confirmPassword"
        name="confirmPassword"
        isRequired
        error={getDisplayErrorMessage(err.confirmPassword?.message, t)}
      >
        <Input
          id="confirmPassword"
          type="password"
          {...form.register('confirmPassword')}
          disabled={registerMutation.isPending}
          placeholder={t('auth.form.passwordPlaceholder')}
        />
      </FormField>

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
