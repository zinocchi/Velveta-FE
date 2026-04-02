import React from 'react';
import { ChartType, DateRange } from '../../../types/chart';
import { FaCalendarAlt, FaSyncAlt, FaDownload } from 'react-icons/fa';
import { cn } from '../../../libs/utils';

interface ChartControlsProps {
  chartType: ChartType;
  onChartTypeChange: (type: ChartType) => void;
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
  onRefresh: () => void;
  onExport?: () => void;
  loading?: boolean;
}

const chartTypes: { value: ChartType; label: string }[] = [
  { value: 'area', label: 'Area' },
  { value: 'line', label: 'Line' },
  { value: 'bar', label: 'Bar' },
];

const ChartControls: React.FC<ChartControlsProps> = ({
  chartType,
  onChartTypeChange,
  dateRange,
  onDateRangeChange,
  onRefresh,
  onExport,
  loading = false,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-4 mb-4">
      {/* Chart Type Selector */}
      <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
        {chartTypes.map((type) => (
          <button
            key={type.value}
            onClick={() => onChartTypeChange(type.value)}
            className={cn(
              'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
              chartType === type.value
                ? 'bg-white text-red-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            )}
          >
            {type.label}
          </button>
        ))}
      </div>

      {/* Date Range Selector */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <FaCalendarAlt className="w-4 h-4 text-gray-400" />
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => onDateRangeChange({ ...dateRange, start: e.target.value })}
            className="px-2 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-200"
          />
        </div>
        <span className="text-gray-400">-</span>
        <input
          type="date"
          value={dateRange.end}
          onChange={(e) => onDateRangeChange({ ...dateRange, end: e.target.value })}
          className="px-2 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-200"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 ml-auto">
        <button
          onClick={onRefresh}
          disabled={loading}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          title="Refresh"
        >
          <FaSyncAlt className={cn('w-4 h-4 text-gray-500', loading && 'animate-spin')} />
        </button>
        {onExport && (
          <button
            onClick={onExport}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Export as CSV"
          >
            <FaDownload className="w-4 h-4 text-gray-500" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ChartControls;