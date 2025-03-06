import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess, logout as logoutAction } from '../store/authSlice';
import LoadingSpinner from '../atoms/LoadingSpinner';
import { getCurrentUser, handleLogout } from './HandleLogin';

type AuthContextType = {
  userName: string | null;
  userRole: number | null;
  userAuth: number[] | null;
  loading: boolean;
  login: (user: string, role: number, auth: number[]) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userName, setUserName] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<number | null>(null);
  const [userAuth, setUserAuth] = useState<number[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    // Ambil data user dari session
    const user = getCurrentUser();
    if (user) {
      setUserName(user.nama);
      setUserRole(user.role);
      setUserAuth([]); // Jika perlu menyimpan auth khusus
      dispatch(loginSuccess(user.nama));
    } else {
      setUserName(null);
      setUserRole(null);
      setUserAuth(null);
      dispatch(logoutAction());
    }
    setLoading(false);
  }, [dispatch]);

  const login = (user: string, role: number, auth: number[]) => {
    setUserName(user);
    setUserRole(role);
    setUserAuth(auth);
    dispatch(loginSuccess(user));
  };

  const logout = () => {
    handleLogout(); // Hapus session dari localStorage
    setUserName(null);
    setUserRole(null);
    setUserAuth(null);
    dispatch(logoutAction());
    navigate('/Login');
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <AuthContext.Provider value={{ userName, userRole, userAuth, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};