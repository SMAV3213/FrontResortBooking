import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { User, AuthContextType, LoginDTO, RegisterUserDTO } from '../types/auth';
import { authApi } from '../api/auth';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const initAuth = async () => {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');

      if (accessToken && refreshToken) {
        try {

          const userData = localStorage.getItem('user');
          if (userData) {
            setUser(JSON.parse(userData));
          }
        } catch (err) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = useCallback(async (loginData: LoginDTO) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await authApi.login(loginData);
      const { accessToken, refreshToken } = response.data;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      // Создаём объект пользователя на основе полученных данных
      const userData: User = {
        id: loginData.login,
        login: loginData.login,
        email: '',
        phoneNumber: '',
      };

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ошибка входа';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (registerData: RegisterUserDTO) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await authApi.register(registerData);
      const { accessToken, refreshToken } = response.data;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      const userData: User = {
        id: registerData.login,
        login: registerData.login,
        email: registerData.email,
        phoneNumber: registerData.phoneNumber,
      };

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ошибка регистрации';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await authApi.logout(refreshToken);
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      setUser(null);
      setIsLoading(false);
    }
  }, []);

  const refreshToken = useCallback(async () => {
    try {
      const token = localStorage.getItem('refreshToken');
      if (!token) throw new Error('No refresh token');

      const response = await authApi.refresh(token);
      const { accessToken, refreshToken: newRefreshToken } = response.data;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', newRefreshToken);
    } catch (err) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      setUser(null);
      throw err;
    }
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    register,
    logout,
    refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
