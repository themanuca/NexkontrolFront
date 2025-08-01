import React, { createContext, useContext } from 'react';
import { useAuth } from '../hooks/useAuth';

// Criar contexto com o tipo do hook useAuth
const AuthContext = createContext<ReturnType<typeof useAuth> | undefined>(undefined);

// Hook personalizado para usar o contexto de autenticação
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

// Provedor do contexto de autenticação
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuth();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}; 