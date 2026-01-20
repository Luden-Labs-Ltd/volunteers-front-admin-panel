import { FC, useState } from 'react';

import { LoginForm } from '@/features/admin-login/ui';
import { RegisterForm } from '@/features/admin-register/ui';
import { useI18n } from '@/shared/lib/i18n';
import { Card } from '@/shared/ui';

export const AuthPage: FC = () => {
  const { t } = useI18n();
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-admin-bg flex items-center justify-center px-4 py-6 sm:py-8">
      <Card className="w-full max-w-sm sm:max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {t('common.appTitle')}
          </h1>
          <p className="text-gray-600">
            {isLogin ? t('auth.loginDescription') : t('auth.registerDescription')}
          </p>
        </div>

        <div className="mb-6">
          <div className="flex gap-2 border-b border-gray-200">
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 text-sm font-medium transition-colors ${
                isLogin
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {t('auth.loginTab')}
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 text-sm font-medium transition-colors ${
                !isLogin
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {t('auth.registerTab')}
            </button>
          </div>
        </div>

        {isLogin ? <LoginForm /> : <RegisterForm />}
      </Card>
    </div>
  );
};
