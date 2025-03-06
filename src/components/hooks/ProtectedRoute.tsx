import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import LoadingSpinner from '../atoms/LoadingSpinner';

type ProtectedRouteProps = {
  children: ReactNode;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { userName, loading, userRole } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!userName) {
    return <Navigate to="/Login" replace />;
  }


  if (userRole !== 1) {
    return <Navigate to="/portal" replace />; 
  }

  return <>{children}</>;
};

export default ProtectedRoute;
