import React from "react";
import { DeliveryOption, DeliveryEstimate } from "../../../types/checkout";
import { FaClock, FaCheckCircle, FaMotorcycle } from "react-icons/fa";

interface DeliveryOptionsProps {
  options: DeliveryOption[];
  selectedOption: string;
  onSelect: (id: string) => void;
  estimate: DeliveryEstimate | null;
  formatEstimate: (min: number, max: number) => string;
}

const iconMap: Record<string, any> = {
  FaMotorcycle,
  FaClock,
};

const DeliveryOptions: React.FC<DeliveryOptionsProps> = ({
  options,
  selectedOption,
  onSelect,
  estimate,
  formatEstimate,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-red-200 p-6 hover:shadow-md transition-shadow">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <span className="w-1 h-6 bg-red-700 rounded-full"></span>
        Shipping Option
      </h2>

      <div className="space-y-3">
        {options.map((option) => {
          const Icon =
            iconMap[option.icon as keyof typeof iconMap] || FaMotorcycle;
          const isSelected = selectedOption === option.id;

          return (
            <label
              key={option.id}
              className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                isSelected
                  ? "border-red-700 bg-red-50"
                  : "border-gray-200 hover:border-red-300"
              }`}>
              <input
                type="radio"
                name="delivery"
                value={option.id}
                checked={isSelected}
                onChange={() => onSelect(option.id)}
                className="hidden"
              />
              <div className="flex items-center gap-4 flex-1">
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    isSelected ? "bg-red-100" : "bg-gray-100"
                  }`}>
                  <Icon
                    className={`w-6 h-6 ${isSelected ? "text-red-700" : "text-gray-600"}`}
                  />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{option.name}</p>
                  <p className="text-sm text-gray-500">{option.description}</p>
                  {estimate && isSelected && (
                    <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                      <FaClock className="w-3 h-3" />
                      Estimated to: {estimate.timeRange} (
                      {formatEstimate(
                        option.estimateMinutes.min,
                        option.estimateMinutes.max,
                      )}
                      )
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-800">
                    Rp {option.cost.toLocaleString()}
                  </p>
                </div>
              </div>
              {isSelected && (
                <div className="w-5 h-5 bg-red-700 rounded-full flex items-center justify-center ml-2">
                  <FaCheckCircle className="w-3 h-3 text-white" />
                </div>
              )}
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default DeliveryOptions;
