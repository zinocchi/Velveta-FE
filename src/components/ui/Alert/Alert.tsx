import React, { useEffect } from "react";
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react";
import { cn } from "../../../libs/utils";

export type AlertType = "success" | "error" | "warning" | "info";

interface AlertProps {
  type?: AlertType;
  title?: string;
  message?: string;
  className?: string;
  children?: React.ReactNode;
  onClose?: () => void;
}

export const Alert: React.FC<AlertProps> = ({
  type = "info",
  title,
  message,
  className,
  children,
  onClose,
}) => {
  const typeStyles = {
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
  };

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <AlertCircle className="w-5 h-5 text-red-500" />,
    warning: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
  };

  return (
    <div className={cn(`rounded-lg border p-4 ${typeStyles[type]}`, className)}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">{icons[type]}</div>
        <div className="flex-1">
          {title && <h3 className="text-sm font-semibold mb-1">{title}</h3>}
          {message && <p className="text-sm">{message}</p>}
          {children}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

// Notification Component
export interface NotificationProps {
  show: boolean;
  message: string;
  type?: AlertType;
  onClose: () => void;
  duration?: number;
}

export const Notification: React.FC<NotificationProps> = ({
  show,
  message,
  type = "info",
  onClose,
  duration = 5000,
}) => {
  useEffect(() => {
    if (show && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  if (!show) return null;

  const typeStyles = {
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
  };

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <AlertCircle className="w-5 h-5 text-red-500" />,
    warning: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
  };

  return (
    <div className="fixed top-20 right-4 z-50 animate-slide-in">
      <div
        className={`rounded-lg border p-4 shadow-lg max-w-sm ${typeStyles[type]}`}>
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">{icons[type]}</div>
          <div className="flex-1 text-sm font-medium">{message}</div>
          <button
            onClick={onClose}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Confirm Modal Component
export interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: "danger" | "warning" | "info";
  loading?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  type = "warning",
  loading = false,
}) => {
  if (!isOpen) return null;

  const typeStyles = {
    danger: {
      button: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
      icon: "text-red-600",
    },
    warning: {
      button: "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500",
      icon: "text-yellow-600",
    },
    info: {
      button: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
      icon: "text-blue-600",
    },
  };

  const currentStyle = typeStyles[type];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onCancel}
        />

        {/* Modal panel */}
        <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div
                className={`mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 sm:mx-0 sm:h-10 sm:w-10`}>
                {type === "danger" && (
                  <AlertCircle className={`h-6 w-6 ${currentStyle.icon}`} />
                )}
                {type === "warning" && (
                  <AlertTriangle className={`h-6 w-6 ${currentStyle.icon}`} />
                )}
                {type === "info" && (
                  <Info className={`h-6 w-6 ${currentStyle.icon}`} />
                )}
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  {title}
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">{message}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              type="button"
              onClick={onConfirm}
              disabled={loading}
              className={`inline-flex w-full justify-center rounded-md border border-transparent px-4 py-2 text-base font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm ${currentStyle.button} ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}>
              {loading ? "Processing..." : confirmText}
            </button>
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm">
              {cancelText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
