// src/components/ui/Toast.tsx
// Componente visual para uma única notificação "toast".

import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Info, Loader } from 'lucide-react'; // Ícones para diferentes tipos de toast
import { cn } from '../../lib/utils'; // Função para combinar classes Tailwind

// Interface para as propriedades de um toast
export interface ToastProps {
  id: string; // ID único do toast
  message: string; // Mensagem a ser exibida
  type: 'success' | 'error' | 'info' | 'loading'; // Tipo do toast para estilização e ícone
  duration?: number; // Duração em milissegundos antes de desaparecer (0 para persistente)
  onClose: (id: string) => void; // Callback para quando o toast deve ser fechado
}

export const Toast: React.FC<ToastProps> = ({ id, message, type, duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  // Define o ícone e as cores com base no tipo de toast
  let icon: React.ReactNode;
  let bgColorClass: string;
  let textColorClass: string;

  switch (type) {
    case 'success':
      icon = <CheckCircle className="w-5 h-5" />;
      bgColorClass = 'bg-green-500 dark:bg-green-700';
      textColorClass = 'text-white';
      break;
    case 'error':
      icon = <XCircle className="w-5 h-5" />;
      bgColorClass = 'bg-red-500 dark:bg-red-700';
      textColorClass = 'text-white';
      break;
    case 'info':
      icon = <Info className="w-5 h-5" />;
      bgColorClass = 'bg-blue-500 dark:bg-blue-700';
      textColorClass = 'text-white';
      break;
    case 'loading':
      icon = <Loader className="w-5 h-5 animate-spin" />; // Ícone giratório para loading
      bgColorClass = 'bg-gray-700 dark:bg-gray-900';
      textColorClass = 'text-white';
      break;
    default:
      icon = null;
      bgColorClass = 'bg-gray-600 dark:bg-gray-800';
      textColorClass = 'text-white';
  }

  // Efeito para fechar o toast automaticamente após a duração
  useEffect(() => {
    if (duration > 0 && type !== 'loading') { // Toasts de loading não fecham automaticamente
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose(id); // Chama o callback para remover do estado global
      }, duration);
      return () => clearTimeout(timer); // Limpa o timer se o componente for desmontado
    }
  }, [duration, id, onClose, type]);

  if (!isVisible) return null; // Não renderiza se não estiver visível

  return (
    <div
      className={cn(
        "flex items-center gap-3 p-4 rounded-lg shadow-lg transition-all duration-300 ease-out",
        "transform translate-x-0 opacity-100", // Estilos iniciais para animação
        bgColorClass,
        textColorClass
      )}
      role="alert" // Para acessibilidade
    >
      {icon}
      <span className="font-medium">{message}</span>
      {/* Botão de fechar manual (opcional, pode ser adicionado para todos os tipos) */}
      {/* <button onClick={() => onClose(id)} className="ml-auto text-white opacity-70 hover:opacity-100">
        <X className="w-4 h-4" />
      </button> */}
    </div>
  );
};
