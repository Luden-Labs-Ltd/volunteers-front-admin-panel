import { FC, ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getToken } from '@/shared/lib/auth';

interface PrivateRouteProps {
  children: ReactNode;
}

export const PrivateRoute: FC<PrivateRouteProps> = ({ children }) => {
  const token = getToken();
  const location = useLocation();

  // Редирект с /auth если уже авторизован
  if (location.pathname === '/auth' && token) {
    return <Navigate to="/" replace />;
  }

  if (!token) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};
