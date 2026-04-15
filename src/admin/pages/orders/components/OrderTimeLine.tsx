import React from 'react';
import { Order } from '../../../types/order';
import { FaHistory, FaCalendarAlt, FaClock, FaCheckCircle, FaTimesCircle, FaHourglassHalf } from 'react-icons/fa';
import { formatDateTime, formatTimeOnly } from '../../../../utils/formatters';

interface OrderTimelineProps {
  order: Order;
}

const calculateDuration = (startDate: string, endDate: string) => {
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  const durationMs = end - start;
  const minutes = Math.floor(durationMs / 60000);
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours > 0) {
    return `${hours}h ${remainingMinutes}m`;
  }
  return `${minutes}m`;
};

const OrderTimeline: React.FC<OrderTimelineProps> = ({ order }) => {
  const isCompleted = order.status === 'COMPLETED';
  const hasProcessing = order.processing_at || isCompleted;
  const hasCompleted = order.completed_at || isCompleted;

  if (!hasProcessing && !hasCompleted) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <FaHistory className="w-5 h-5 text-gray-500" />
        Order Timeline
      </h3>

      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <FaCalendarAlt className="w-4 h-4 text-gray-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">Order Created</p>
            <p className="text-sm text-gray-500">{formatDateTime(order.created_at)}</p>
          </div>
        </div>

        {order.processing_at && (
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <FaClock className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Order Processed</p>
              <p className="text-sm text-gray-500">{formatDateTime(order.processing_at)}</p>
            </div>
          </div>
        )}

        {order.completed_at && (
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
              <FaCheckCircle className="w-4 h-4 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Order Completed</p>
              <p className="text-sm text-gray-500">{formatDateTime(order.completed_at)}</p>
            </div>
          </div>
        )}

        {order.cancelled_at && (
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
              <FaTimesCircle className="w-4 h-4 text-red-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Order Cancelled</p>
              <p className="text-sm text-gray-500">{formatDateTime(order.cancelled_at)}</p>
            </div>
          </div>
        )}

        {order.completed_at && order.processing_at && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <FaHourglassHalf className="w-4 h-4 text-gray-500" />
                Processing Duration
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Processing Time</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {calculateDuration(order.processing_at, order.completed_at)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Completed At</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatTimeOnly(order.completed_at)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTimeline;