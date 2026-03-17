import React from 'react';
import { cn } from '../../../libs/utils'; 

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'red' | 'white' | 'gray' | 'brown';
  className?: string;
}

const sizeClasses = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-2',
  lg: 'h-12 w-12 border-t-2 border-b-2',
  xl: 'h-16 w-16 border-4',
};

const colorClasses = {
  red: 'border-red-700',
  white: 'border-white',
  gray: 'border-gray-300',
  brown: 'border-amber-800',
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'red',
  className,
}) => {
  return (
    <div
      className={cn(
        'inline-block animate-spin rounded-full',
        sizeClasses[size],
        colorClasses[color],
        'border-t-transparent border-b-transparent',
        className
      )}
    />
  );
};