import React from 'react';
import { cn } from '../../../libs/utils'; 

interface LoadingDotsProps {
  color?: 'red' | 'white' | 'gray' | 'brown';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const dotColors = {
  red: 'bg-red-700',
  white: 'bg-white',
  gray: 'bg-gray-400',
  brown: 'bg-amber-800',
};

const dotSizes = {
  sm: 'h-1.5 w-1.5',
  md: 'h-2 w-2',
  lg: 'h-3 w-3',
};

export const LoadingDots: React.FC<LoadingDotsProps> = ({
  color = 'red',
  size = 'md',
  className,
}) => {
  return (
    <div className={cn('flex space-x-1 justify-center items-center', className)}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn(
            'rounded-full animate-bounce',
            dotSizes[size],
            dotColors[color]
          )}
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
};