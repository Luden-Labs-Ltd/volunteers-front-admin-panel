import { FC } from 'react';

import { useLogout } from '@/entities/auth';
import { LanguageSwitcher } from '@/features/language-switcher/ui';
import { useI18n } from '@/shared/lib/i18n';
import { Button } from '@/shared/ui';

interface HeaderProps {
  onToggleSidebar?: () => void;
}

export const Header: FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { t } = useI18n();
  const logoutMutation = useLogout();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Burger button - mobile only */}
          <button
            type="button"
            onClick={onToggleSidebar}
            className="md:hidden p-2 -ml-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          <h1 className="text-lg sm:text-xl font-bold text-primary-600">
            {t('common.appTitle')}
          </h1>
          <LanguageSwitcher />
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
          className="text-xs sm:text-sm"
        >
          {logoutMutation.isPending ? t('auth.logoutPending') : t('auth.logout')}
        </Button>
      </div>
    </header>
  );
};
