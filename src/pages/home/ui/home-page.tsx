import { FC } from 'react';

import { Layout } from '@/widgets/layout';
import { Card } from '@/shared/ui';
import { useI18n } from '@/shared/lib/i18n';

export const HomePage: FC = () => {
  const { t } = useI18n();

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {t('home.title')}
          </h2>
          <p className="text-gray-600 mt-2">{t('home.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card title={t('home.cards.programsTitle')}>
            <p className="text-gray-600">{t('home.cards.programsDescription')}</p>
          </Card>
          <Card title={t('home.cards.tasksTitle')}>
            <p className="text-gray-600">{t('home.cards.tasksDescription')}</p>
          </Card>
          <Card title={t('home.cards.usersTitle')}>
            <p className="text-gray-600">{t('home.cards.usersDescription')}</p>
          </Card>
        </div>
      </div>
    </Layout>
  );
};
