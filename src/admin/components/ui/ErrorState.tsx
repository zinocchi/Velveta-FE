import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry }) => {
  return (
    <div className="text-center max-w-md mx-auto py-12">
      <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
        <FaExclamationTriangle className="w-10 h-10 text-red-600" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">Error</h3>
      <p className="text-gray-600 mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
};