import { FC, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { getToken } from '@/shared/lib/auth';

interface PrivateRouteProps {
  children: ReactNode;
}

export const PrivateRoute: FC<PrivateRouteProps> = ({ children }) => {
  const token = getToken();

  if (!token) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};
