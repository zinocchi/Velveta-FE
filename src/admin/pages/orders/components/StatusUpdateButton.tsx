import React from "react";
import { FaClock, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { Order, OrderStatus } from "../../../types/order";

interface StatusUpdateButtonsProps {
  order: Order;
  onStatusClick: (status: string) => void;
  updating: boolean;
}

const StatusUpdateButtons: React.FC<StatusUpdateButtonsProps> = ({
  order,
  onStatusClick,
  updating,
}) => {
  const isCompleted = order.status === "COMPLETED";
  const isCancelled = order.status === "CANCELLED";
  const isProcessing = order.status === "PROCESSING";

  if (isCompleted || isCancelled) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Order Status
        </h3>
        <div className="flex flex-wrap gap-3">
          {isCompleted && (
            <div className="px-4 py-2 rounded-xl font-medium flex items-center gap-2 bg-green-100 text-green-700">
              <FaCheckCircle className="w-4 h-4" />
              This order has been completed
            </div>
          )}
          {isCancelled && (
            <div className="px-4 py-2 rounded-xl font-medium flex items-center gap-2 bg-red-100 text-red-700">
              <FaTimesCircle className="w-4 h-4" />
              This order has been cancelled
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Update Order Status
      </h3>
      <div className="flex flex-wrap gap-3">
        {/* Processing Button - disable if already processing */}
        <button
          onClick={() => onStatusClick("PROCESSING")}
          disabled={isProcessing || updating}
          className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 ${
            isProcessing
              ? "bg-blue-100 text-blue-700 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow"
          } disabled:opacity-50 disabled:cursor-not-allowed`}>
          <FaClock className="w-4 h-4" />
          {isProcessing ? "Processing" : "Mark as Processing"}
        </button>

        {/* Completed Button - always enabled if not completed/cancelled */}
        <button
          onClick={() => onStatusClick("COMPLETED")}
          disabled={updating}
          className="px-4 py-2 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 shadow-sm hover:shadow transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
          <FaCheckCircle className="w-4 h-4" />
          Mark as Completed
        </button>

        {/* Cancelled Button - always enabled if not completed/cancelled */}
        <button
          onClick={() => onStatusClick("CANCELLED")}
          disabled={updating}
          className="px-4 py-2 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 shadow-sm hover:shadow transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
          <FaTimesCircle className="w-4 h-4" />
          Cancel Order
        </button>
      </div>
    </div>
  );
};

export default StatusUpdateButtons;
