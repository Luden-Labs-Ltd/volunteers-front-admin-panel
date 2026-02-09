import { FC } from 'react';
import { NavLink } from 'react-router-dom';

import { useI18n } from '@/shared/lib/i18n';
import { cn } from '@/shared/lib/utils';

interface NavItem {
  path: string;
  label: string;
  icon?: string;
}

interface SidebarProps {
  onNavigate?: () => void;
}

export const Sidebar: FC<SidebarProps> = ({ onNavigate }) => {
  const { t } = useI18n();

  const navItems: NavItem[] = [
    { path: '/', label: t('nav.home'), icon: '🏠' },
    { path: '/programs', label: t('nav.programs'), icon: '📋' },
    { path: '/categories', label: t('nav.categories'), icon: '📁' },
    { path: '/skills', label: t('nav.skills'), icon: '🎯' },
    { path: '/tasks', label: t('nav.tasks'), icon: '✅' },
    { path: '/users', label: t('nav.users'), icon: '👥' },
    { path: '/cities', label: t('nav.cities'), icon: '🏙️' },
    { path: '/city-groups', label: t('nav.cityGroups'), icon: '📍' },
  ];

  return (
    <aside className="w-64 bg-admin-sidebar min-h-screen text-white">
      <nav className="p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                onClick={onNavigate}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-4 py-2 rounded-lg transition-colors',
                    isActive
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  )
                }
              >
                {item.icon && <span>{item.icon}</span>}
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};
