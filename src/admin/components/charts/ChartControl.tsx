
import React from 'react';
import { ChartType } from '../../types/chart';
import { FaSyncAlt, FaDownload } from 'react-icons/fa';
import { cn } from '../../../libs/utils';

interface ChartControlsProps {
  /** Current chart type */
  chartType: ChartType;
  /** Callback when chart type changes */
  onChartTypeChange: (type: ChartType) => void;
  /** Callback when refresh button is clicked */
  onRefresh: () => void;
  /** Callback when export button is clicked */
  onExport?: () => void;
  /** Loading state */
  loading?: boolean;
  /** Additional CSS classes */
  className?: string;
}

const chartTypes: { value: ChartType; label: string }[] = [
  { value: 'area', label: 'Area' },
  { value: 'line', label: 'Line' },
  { value: 'bar', label: 'Bar' },
];

const ChartControls: React.FC<ChartControlsProps> = ({
  chartType,
  onChartTypeChange,
  onRefresh,
  onExport,
  loading = false,
  className,
}) => {
  return (
    <div className={cn("flex flex-wrap items-center justify-between gap-3 mb-4 pb-4 border-b border-gray-100", className)}>
      {/* Chart Type Toggle */}
      <div className="flex items-center gap-0.5 bg-gray-100 p-0.5 rounded-lg">
        {chartTypes.map((type) => (
          <button
            key={type.value}
            onClick={() => onChartTypeChange(type.value)}
            className={cn(
              'px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200',
              chartType === type.value
                ? 'bg-white text-red-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            )}
          >
            {type.label}
          </button>
        ))}
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-1">
        <button
          onClick={onRefresh}
          disabled={loading}
          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          title="Refresh"
        >
          <FaSyncAlt className={cn('w-3.5 h-3.5 text-gray-500', loading && 'animate-spin')} />
        </button>
        {onExport && (
          <button
            onClick={onExport}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            title="Export as CSV"
          >
            <FaDownload className="w-3.5 h-3.5 text-gray-500" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ChartControls;