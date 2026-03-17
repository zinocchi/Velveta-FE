import React from 'react';
import { cn } from '../../../libs/utils'; 

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  count?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'rectangular',
  width,
  height,
  count = 1,
}) => {
  const baseClasses = cn(
    'animate-pulse bg-gray-200 rounded',
    variant === 'circular' && 'rounded-full',
    variant === 'text' && 'h-4 rounded',
    className
  );

  const style = {
    width: width ? (typeof width === 'number' ? `${width}px` : width) : undefined,
    height: height ? (typeof height === 'number' ? `${height}px` : height) : undefined,
  };

  if (count > 1) {
    return (
      <>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className={baseClasses} style={style} />
        ))}
      </>
    );
  }

  return <div className={baseClasses} style={style} />;
};