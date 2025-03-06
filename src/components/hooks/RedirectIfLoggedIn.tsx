import { useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

type RedirectIfLoggedInProps = {
    children: ReactNode; 
  };

const RedirectIfLoggedIn = ({ children }: RedirectIfLoggedInProps) => {
  const { userName, userRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (userName) {
      if (userRole === 1) {
        navigate('/home');
      } else {
        navigate('/portal'); 
      }
    }
  }, [userName, userRole, navigate]);

  return <>{children}</>;; 
};

export default RedirectIfLoggedIn;


