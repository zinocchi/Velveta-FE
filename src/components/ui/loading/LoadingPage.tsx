import React from 'react';
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
  // Map spinner sizes to Tailwind classes
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  // Map spinner colors to Tailwind border color classes
  const colorClasses = {
    red: 'border-red-700',
    white: 'border-white',
    gray: 'border-gray-500',
    brown: 'border-amber-800',
  };

  const content = (
    <div className={cn('text-center py-12', className)}>
      <div
        className={cn(
          'inline-block animate-spin rounded-full border-t-2 border-b-2',
          sizeClasses[spinnerSize],
          colorClasses[spinnerColor]
        )}
      />
      {message && (
        <p className="mt-4 text-gray-600">{message}</p>
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

  return (
    <main className="pt-28 pb-16 max-w-7xl mx-auto px-4">
      {content}
    </main>
  );
};