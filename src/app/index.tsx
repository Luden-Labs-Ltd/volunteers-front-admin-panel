import { FC } from 'react';

import { I18nProvider } from '../shared/lib/i18n';
import { QueryProvider } from './providers';
import { Router } from './providers/router';

export const App: FC = () => {
  return (
    <QueryProvider>
      <I18nProvider>
        <Router />
      </I18nProvider>
    </QueryProvider>
  );
};
