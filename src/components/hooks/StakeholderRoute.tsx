import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import LoadingSpinner from '../atoms/LoadingSpinner';

type StakeholderRouteProps = {
  children: ReactNode;
};

const StakeholderRoute = ({ children }: StakeholderRouteProps) => {
  const { userName, loading, userRole } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!userName) {
    return <Navigate to="/Login" replace />;
  }

  if (userRole === 1) {
    return <Navigate to="/Home" replace />; 
  }

  return <>{children}</>;
};

export default StakeholderRoute;
