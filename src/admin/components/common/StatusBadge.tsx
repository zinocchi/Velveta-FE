import React from 'react';
import { cn } from '../../../libs/utils';

type StatusType = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED' | 'ACTIVE' | 'INACTIVE';

interface StatusBadgeProps {
  status: StatusType | string;
  className?: string;
}

const statusConfig: Record<string, { color: string; label: string }> = {
  PENDING: {
    color: 'bg-yellow-50 text-yellow-700',
    label: 'Pending',
  },
  PROCESSING: {
    color: 'bg-blue-50 text-blue-700',
    label: 'Processing',
  },
  COMPLETED: {
    color: 'bg-green-50 text-green-700',
    label: 'Completed',
  },
  CANCELLED: {
    color: 'bg-red-50 text-red-700',
    label: 'Cancelled',
  },
  ACTIVE: {
    color: 'bg-green-50 text-green-700',
    label: 'Active',
  },
  INACTIVE: {
    color: 'bg-gray-50 text-gray-700',
    label: 'Inactive',
  },
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const config = statusConfig[status] || {
    color: 'bg-gray-50 text-gray-700',
    label: status,
  };

  return (
    <span
      className={cn(
        'px-2 py-0.5 rounded-full text-xs font-medium',
        config.color,
        className
      )}
    >
      {config.label}
    </span>
  );
};

export default StatusBadge;