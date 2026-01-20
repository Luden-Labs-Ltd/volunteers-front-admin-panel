import { FC, useState } from 'react';
import { Button, Input } from '@/shared/ui';
import { useAdminRegister } from '@/entities/auth';

export const RegisterForm: FC = () => {
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
      newErrors.email = 'Email обязателен';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Некорректный email';
    }

    if (!password) {
      newErrors.password = 'Пароль обязателен';
    } else if (password.length < 6) {
      newErrors.password = 'Пароль должен быть не менее 6 символов';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Подтверждение пароля обязательно';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают';
    }

    if (!firstName) {
      newErrors.firstName = 'Имя обязательно';
    }

    if (!lastName) {
      newErrors.lastName = 'Фамилия обязательна';
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
          label="Имя"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          error={errors.firstName}
          disabled={registerMutation.isPending}
          placeholder="Иван"
          required
        />

        <Input
          label="Фамилия"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          error={errors.lastName}
          disabled={registerMutation.isPending}
          placeholder="Иванов"
          required
        />
      </div>

      <Input
        type="email"
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
        disabled={registerMutation.isPending}
        placeholder="admin@example.com"
        required
      />

      <Input
        type="password"
        label="Пароль"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
        disabled={registerMutation.isPending}
        placeholder="••••••••"
        required
      />

      <Input
        type="password"
        label="Подтверждение пароля"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        error={errors.confirmPassword}
        disabled={registerMutation.isPending}
        placeholder="••••••••"
        required
      />

      <Button
        type="submit"
        variant="primary"
        className="w-full"
        disabled={registerMutation.isPending}
      >
        {registerMutation.isPending ? 'Регистрация...' : 'Зарегистрироваться'}
      </Button>
    </form>
  );
};
