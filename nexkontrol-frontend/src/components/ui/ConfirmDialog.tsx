import React from 'react';
import { AlertTriangle, Info,Trash2, Edit3 } from 'lucide-react';
import { Button } from './button';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
  icon?: 'delete' | 'edit' | 'warning' | 'info';
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  type = 'danger',
  icon = 'warning'
}) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (icon) {
      case 'delete':
        return <Trash2 className="w-6 h-6 text-red-600" />;
      case 'edit':
        return <Edit3 className="w-6 h-6 text-blue-600" />;
      case 'warning':
        return <AlertTriangle className="w-6 h-6 text-yellow-600" />;
      case 'info':
        return <Info className="w-6 h-6 text-blue-600" />;
      default:
        return <AlertTriangle className="w-6 h-6 text-red-600" />;
    }
  };

  const getButtonStyle = () => {
    switch (type) {
      case 'danger':
        return 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500';
      case 'warning':
        return 'bg-yellow-600 hover:bg-yellow-700 text-white focus:ring-yellow-500';
      case 'info':
        return 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500';
      default:
        return 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full shadow-2xl border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          {getIcon()}
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">{message}</p>
        <div className="flex gap-3 justify-end">
          <Button
            onClick={onClose}
            variant="outline"
            className="px-4 py-2 transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            {cancelText}
          </Button>
          <Button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-4 py-2 transition-all duration-200 ${getButtonStyle()}`}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog; 