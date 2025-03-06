import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

interface AuthRouteProps {
  auth: number[];
  children: React.ReactNode;
}

const AuthRoute: React.FC<AuthRouteProps> = ({ auth, children }) => {
  const { userRole, userAuth } = useAuth();

  const hasAccess = userAuth?.some((level) => auth.includes(level));

  if (!hasAccess) {
    
    if (userRole !== 1) {
        return <Navigate to="/portal" replace />; 
    } 
    
    return <Navigate to="/Home" />; 
  
  }

  return <>{children}</>;
};

export default AuthRoute;
