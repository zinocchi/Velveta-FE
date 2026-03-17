import React, { useEffect } from 'react';
import { 
  FaCheckCircle, 
  FaExclamationTriangle, 
  FaInfoCircle, 
  FaTimes,
  FaFire,
  FaCoffee
} from 'react-icons/fa';
import { cn } from '../../../libs/utils'; 

export type AlertType = 'success' | 'error' | 'warning' | 'info' | 'fire' | 'coffee';

interface AlertProps {
  type?: AlertType;
  title?: string;
  message: string;
  showIcon?: boolean;
  dismissible?: boolean;
  onDismiss?: () => void;
  autoClose?: number; // milliseconds
  className?: string;
}

const alertStyles: Record<AlertType, { bg: string; border: string; text: string; icon: any; iconBg: string }> = {
  success: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-800',
    icon: FaCheckCircle,
    iconBg: 'bg-green-100 text-green-600',
  },
  error: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-800',
    icon: FaExclamationTriangle,
    iconBg: 'bg-red-100 text-red-600',
  },
  warning: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    text: 'text-yellow-800',
    icon: FaExclamationTriangle,
    iconBg: 'bg-yellow-100 text-yellow-600',
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-800',
    icon: FaInfoCircle,
    iconBg: 'bg-blue-100 text-blue-600',
  },
  fire: {
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    text: 'text-orange-800',
    icon: FaFire,
    iconBg: 'bg-orange-100 text-orange-600',
  },
  coffee: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-800',
    icon: FaCoffee,
    iconBg: 'bg-amber-100 text-amber-700',
  },
};

export const Alert: React.FC<AlertProps> = ({
  type = 'info',
  title,
  message,
  showIcon = true,
  dismissible = false,
  onDismiss,
  autoClose,
  className,
}) => {
  const [isVisible, setIsVisible] = React.useState(true);
  const Icon = alertStyles[type].icon;

  useEffect(() => {
    if (autoClose && autoClose > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onDismiss?.();
      }, autoClose);
      return () => clearTimeout(timer);
    }
  }, [autoClose, onDismiss]);

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        'rounded-lg border p-4 shadow-sm',
        alertStyles[type].bg,
        alertStyles[type].border,
        className
      )}
      role="alert"
    >
      <div className="flex items-start gap-3">
        {showIcon && (
          <div className={cn('p-2 rounded-full', alertStyles[type].iconBg)}>
            <Icon className="w-5 h-5" />
          </div>
        )}
        
        <div className="flex-1">
          {title && (
            <h3 className={cn('font-semibold mb-1', alertStyles[type].text)}>
              {title}
            </h3>
          )}
          <p className={cn('text-sm', alertStyles[type].text)}>{message}</p>
        </div>

        {dismissible && (
          <button
            onClick={() => {
              setIsVisible(false);
              onDismiss?.();
            }}
            className={cn(
              'p-1 rounded-lg transition-colors',
              alertStyles[type].text,
              'hover:bg-black/5'
            )}
          >
            <FaTimes className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};