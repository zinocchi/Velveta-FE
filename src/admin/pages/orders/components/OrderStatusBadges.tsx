import React from 'react';
import { OrderStatus, STATUS_CONFIG } from '../../../types/order';
import { cn } from '../../../../libs/utils';

interface OrderStatusBadgeProps {
  status: OrderStatus | string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base',
};

const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({
  status,
  size = 'sm',
  className,
}) => {
  const config = STATUS_CONFIG[status as OrderStatus] || {
    color: 'text-gray-700',
    bgColor: 'bg-gray-100',
    label: status,
  };

  return (
    <span
      className={cn(
        'rounded-full font-medium',
        config.bgColor,
        config.color,
        sizeClasses[size],
        className
      )}
    >
      {config.label}
    </span>
  );
};

export default OrderStatusBadge;