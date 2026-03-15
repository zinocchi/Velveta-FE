// components/OrderStatusBadges.tsx
import React from 'react';
import { FaClock, FaSpinner, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

interface OrderStatusBadgeProps {
  status: string; // Bisa "PENDING", "PROCESSING", "COMPLETED", "CANCELLED"
  size?: 'sm' | 'md' | 'lg';
}

const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status, size = 'md' }) => {
  console.log('🎯 Badge received status:', status); // Debug

  const getStatusConfig = (status: string) => {
    // Normalize status
    const upperStatus = status?.toUpperCase() || '';
    
    switch (upperStatus) {
      case 'PENDING':
        return {
          bg: 'bg-yellow-100',
          text: 'text-yellow-800',
          border: 'border-yellow-200',
          icon: FaClock,
          label: 'Pending',
        };
      case 'PROCESSING':
        return {
          bg: 'bg-blue-100',
          text: 'text-blue-800',
          border: 'border-blue-200',
          icon: FaSpinner,
          label: 'Processing',
        };
      case 'COMPLETED':
        return {
          bg: 'bg-green-100',
          text: 'text-green-800',
          border: 'border-green-200',
          icon: FaCheckCircle,
          label: 'Completed',
        };
      case 'CANCELLED':
        return {
          bg: 'bg-red-100',
          text: 'text-red-800',
          border: 'border-red-200',
          icon: FaTimesCircle,
          label: 'Cancelled',
        };
      default:
        console.warn('Unknown status:', status);
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-800',
          border: 'border-gray-200',
          icon: FaClock,
          label: status || 'Unknown',
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium border ${config.bg} ${config.text} ${config.border} ${sizeClasses[size]}`}
    >
      <Icon className={size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
      {config.label}
    </span>
  );
};

export default OrderStatusBadge;