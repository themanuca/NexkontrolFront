import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService, type AuthResponse, type LoginData, type RegisterData } from '../services/api';
import { useToast } from '../Context/ToastContext';

interface UseAuthReturn {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: { name: string; email: string } | null;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  validateToken: () => Promise<boolean>;
}

export const useAuth = (): UseAuthReturn => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const navigate = useNavigate();
  const { addToast } = useToast();

  // Verificar token ao inicializar
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const userName = localStorage.getItem('userName');
      
      if (token && userName) {
        try {
          const isValid = await apiService.validateToken();
          if (isValid) {
            setIsAuthenticated(true);
            setUser({ name: userName, email: '' }); // Email pode ser adicionado se necessário
          } else {
            handleLogout();
          }
        } catch (error) {
          handleLogout();
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    setIsAuthenticated(false);
    setUser(null);
    navigate('/login');
  }, [navigate]);

  const login = useCallback(async (data: LoginData) => {
    try {
      const response: AuthResponse = await apiService.login(data);
      
      localStorage.setItem('token', response.token);
      localStorage.setItem('userName', response.name);
      
      setIsAuthenticated(true);
      setUser({ name: response.name, email: response.email });
      
      addToast('Login realizado com sucesso!', 'success');
      navigate('/dashboard');
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Erro ao fazer login';
      addToast(errorMessage, 'error');
      throw error;
    }
  }, [navigate, addToast]);

  const register = useCallback(async (data: RegisterData) => {
    try {
      const response: AuthResponse = await apiService.register(data);
      
      localStorage.setItem('token', response.token);
      localStorage.setItem('userName', response.name);
      
      setIsAuthenticated(true);
      setUser({ name: response.name, email: response.email });
      
      addToast('Cadastro realizado com sucesso!', 'success');
      navigate('/dashboard');
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Erro ao fazer cadastro';
      addToast(errorMessage, 'error');
      throw error;
    }
  }, [navigate, addToast]);

  const logout = useCallback(() => {
    handleLogout();
    addToast('Logout realizado com sucesso!', 'success');
  }, [handleLogout, addToast]);

  const validateToken = useCallback(async (): Promise<boolean> => {
    try {
      const isValid = await apiService.validateToken();
      if (!isValid) {
        handleLogout();
      }
      return isValid;
    } catch {
      handleLogout();
      return false;
    }
  }, [handleLogout]);

  return {
    isAuthenticated,
    isLoading,
    user,
    login,
    register,
    logout,
    validateToken,
  };
}; 