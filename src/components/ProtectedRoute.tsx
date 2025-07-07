
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useHubspot } from '@/context/hubspot';
import PageLoader from './PageLoader';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isConnecting } = useHubspot();

  if (isConnecting) {
    return <PageLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
