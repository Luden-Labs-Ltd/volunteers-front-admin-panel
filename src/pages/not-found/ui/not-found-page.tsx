import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/ui';
import { useI18n } from '@/shared/lib/i18n';

export const NotFoundPage: FC = () => {
  const navigate = useNavigate();
  const { t } = useI18n();

  return (
    <div className="min-h-screen flex items-center justify-center bg-admin-bg">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">
          {t('notFound.message') || 'Страница не найдена'}
        </p>
        <Button onClick={() => navigate('/')} size="lg">
          {t('notFound.backHome') || 'Вернуться на главную'}
        </Button>
      </div>
    </div>
  );
};
