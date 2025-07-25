// src/context/ToastContext.tsx
// Define o contexto React para gerenciar e exibir notificações "toast" globalmente.

import React, { createContext, useContext, useState, useCallback } from 'react';
import { Toast, type ToastProps } from '../components/ui/Toast'; // Importa o componente Toast

// Define o tipo para uma notificação no estado
interface Notification extends ToastProps {
  id: string; // ID único para cada notificação
}

// Define o tipo para o contexto (o que será exposto pelo useToast)
interface ToastContextType {
  addToast: (message: string, type: 'success' | 'error' | 'info' | 'loading', duration?: number) => string;
  removeToast: (id: string) => void;
  updateToast: (id: string, message: string, type: 'success' | 'error' | 'info' | 'loading', duration?: number) => void;
}

// Cria o contexto com um valor padrão (será sobrescrito pelo provedor)
const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Hook personalizado para usar o sistema de toasts
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Componente Provedor de Toasts
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Notification[]>([]);
  let toastIdCounter = 0; // Contador para gerar IDs únicos

  // Função para adicionar um novo toast
  const addToast = useCallback((message: string, type: 'success' | 'error' | 'info' | 'loading', duration?: number): string => {
    const id = `toast-${toastIdCounter++}`; // Gera um ID único
    const newToast: Notification = { id, message, type, duration, onClose: removeToast };
    setToasts((prevToasts) => [...prevToasts, newToast]);
    return id; // Retorna o ID para que o toast possa ser atualizado ou removido programaticamente
  }, []);

  // Função para remover um toast
  const removeToast = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  // Função para atualizar um toast existente (útil para mudar de 'loading' para 'success'/'error')
  const updateToast = useCallback((id: string, message: string, type: 'success' | 'error' | 'info' | 'loading', duration?: number) => {
    setToasts((prevToasts) =>
      prevToasts.map((toast) =>
        toast.id === id ? { ...toast, message, type, duration: duration ?? toast.duration } : toast
      )
    );
  }, []);

  const contextValue = React.useMemo(() => ({ addToast, removeToast, updateToast }), [addToast, removeToast, updateToast]);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {/* Contêiner para exibir os toasts */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3">
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};
