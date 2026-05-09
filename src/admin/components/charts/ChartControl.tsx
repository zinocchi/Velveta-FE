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
  { value: 'area', label: 'Daily Sales' },
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
    <div className="flex flex-wrap items-center gap-3 mb-3 mt-3">
      {/* Chart Type Toggle */}
      <div className="flex items-center gap-0.5 bg-gray-50 p-0.5 rounded-lg">
        {chartTypes.map((type) => (
          <button
            key={type.value}
            onClick={() => onChartTypeChange(type.value)}
            className={cn(
              'px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200',
              chartType === type.value
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-400 hover:text-gray-600'
            )}
          >
            {type.label}
          </button>
        ))}
      </div>

      {/* Date Range */}
      <div className="flex items-center gap-1.5 ml-auto">
        <FaCalendarAlt className="w-3.5 h-3.5 text-gray-300" />
        <input
          type="date"
          value={dateRange.start}
          onChange={(e) => onDateRangeChange({ ...dateRange, start: e.target.value })}
          className="px-2 py-1 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-200 text-gray-500 bg-white"
        />
        <span className="text-gray-300 text-xs">–</span>
        <input
          type="date"
          value={dateRange.end}
          onChange={(e) => onDateRangeChange({ ...dateRange, end: e.target.value })}
          className="px-2 py-1 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-200 text-gray-500 bg-white"
        />
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-1">
        <button
          onClick={onRefresh}
          disabled={loading}
          className="p-1.5 hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50"
          title="Refresh"
        >
          <FaSyncAlt className={cn('w-3.5 h-3.5 text-gray-300', loading && 'animate-spin')} />
        </button>
        {onExport && (
          <button
            onClick={onExport}
            className="p-1.5 hover:bg-gray-50 rounded-lg transition-colors"
            title="Export as CSV"
          >
            <FaDownload className="w-3.5 h-3.5 text-gray-300" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ChartControls;