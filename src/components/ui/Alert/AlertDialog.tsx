import React from 'react';
import { FaExclamationTriangle, FaCheckCircle, FaTimes } from 'react-icons/fa';
import { cn } from '../../../libs/utils'; 

interface AlertDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
  message: string;
  type?: 'danger' | 'success' | 'warning';
  confirmText?: string;
  cancelText?: string;
  showCancel?: boolean;
}

const dialogStyles = {
  danger: {
    icon: FaExclamationTriangle,
    iconColor: 'text-red-600',
    iconBg: 'bg-red-100',
    button: 'bg-red-600 hover:bg-red-700',
    title: 'text-red-700',
  },
  success: {
    icon: FaCheckCircle,
    iconColor: 'text-green-600',
    iconBg: 'bg-green-100',
    button: 'bg-green-600 hover:bg-green-700',
    title: 'text-green-700',
  },
  warning: {
    icon: FaExclamationTriangle,
    iconColor: 'text-yellow-600',
    iconBg: 'bg-yellow-100',
    button: 'bg-yellow-600 hover:bg-yellow-700',
    title: 'text-yellow-700',
  },
};

export const AlertDialog: React.FC<AlertDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = 'danger',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  showCancel = true,
}) => {
  if (!isOpen) return null;

  const styles = dialogStyles[type];
  const Icon = styles.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl animate-in fade-in zoom-in duration-300">
        <div className="flex items-start gap-4">
          <div className={cn('p-3 rounded-full', styles.iconBg)}>
            <Icon className={cn('w-6 h-6', styles.iconColor)} />
          </div>
          
          <div className="flex-1">
            <h3 className={cn('text-lg font-semibold mb-2', styles.title)}>
              {title}
            </h3>
            <p className="text-gray-600 text-sm mb-6">{message}</p>
            
            <div className="flex gap-3 justify-end">
              {showCancel && (
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  {cancelText}
                </button>
              )}
              <button
                onClick={() => {
                  onConfirm?.();
                  onClose();
                }}
                className={cn(
                  'px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors',
                  styles.button
                )}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};