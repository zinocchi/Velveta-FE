import React from 'react';
import { PaymentStep } from '../../../types/checkout';
import { FaCheck } from 'react-icons/fa';

interface CheckoutStepsProps {
  currentStep: PaymentStep;
}

const steps: { id: PaymentStep; label: string }[] = [
  { id: 'confirmation', label: 'Confirm Order' },
  { id: 'payment', label: 'Payment Details' },
  { id: 'processing', label: 'Processing' },
  { id: 'success', label: 'Success' },
];

const CheckoutSteps: React.FC<CheckoutStepsProps> = ({ currentStep }) => {
  const currentIndex = steps.findIndex((step) => step.id === currentStep);

  return (
    <div className="max-w-6xl mx-auto px-4 pt-8">
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const isCompleted = index < currentIndex;
            const isActive = step.id === currentStep;

            return (
              <div key={step.id} className="flex items-center flex-1">
                <div className="relative">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                      isActive
                        ? 'bg-red-600 text-white'
                        : isCompleted
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {isCompleted ? <FaCheck className="w-5 h-5" /> : index + 1}
                  </div>
                  <p className="absolute top-12 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-600 whitespace-nowrap">
                    {step.label}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-4 ${
                      index < currentIndex ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CheckoutSteps;