import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';
import { cn } from '../../../libs/utils'; 

interface LoadingPageProps {
  message?: string;
  fullScreen?: boolean;
  className?: string;
  spinnerSize?: 'sm' | 'md' | 'lg' | 'xl';
  spinnerColor?: 'red' | 'white' | 'gray' | 'brown';
}

export const LoadingPage: React.FC<LoadingPageProps> = ({
  message = 'Loading...',
  fullScreen = false,
  className,
  spinnerSize = 'lg',
  spinnerColor = 'red',
}) => {
  const content = (
    <div className={cn('text-center py-12', className)}>
      <LoadingSpinner size={spinnerSize} color={spinnerColor} />
      {message && (
        <p className="mt-4 text-gray-600 animate-pulse">{message}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
};