import React from 'react';
import { FaMinus, FaPlus } from 'react-icons/fa';

interface QuantityControlProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  maxQuantity?: number;
  disabled?: boolean;
  size?: 'sm' | 'md';
}

const QuantityControl: React.FC<QuantityControlProps> = ({
  quantity,
  onIncrease,
  onDecrease,
  maxQuantity = 10,
  disabled = false,
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-7 h-7 sm:w-8 sm:h-8 text-sm sm:text-base',
  };

  const buttonSize = sizeClasses[size];
  const isMaxReached = quantity >= maxQuantity;

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onDecrease}
        disabled={disabled || quantity === 0}
        className={`${buttonSize} flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-700 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
        aria-label="Decrease quantity"
      >
        <FaMinus className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
      </button>
      
      <span className="w-8 text-center font-semibold text-red-700">
        {quantity}
      </span>
      
      <button
        onClick={onIncrease}
        disabled={disabled || isMaxReached}
        className={`${buttonSize} flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-700 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
        aria-label="Increase quantity"
      >
        <FaPlus className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
      </button>
    </div>
  );
};

export default QuantityControl;