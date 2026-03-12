// admin/components/charts/ChartControls.tsx
import React from 'react';
import { FaChartLine, FaChartBar, FaChartArea } from 'react-icons/fa';

interface ChartControlsProps {
  chartType: 'line' | 'area' | 'bar';
  onChartTypeChange: (type: 'line' | 'area' | 'bar') => void;
  dateRange: { start: string; end: string };
  onDateRangeChange: (range: { start: string; end: string }) => void;
  onRefresh: () => void;
  loading?: boolean;
}

const ChartControls: React.FC<ChartControlsProps> = ({
  chartType,
  onChartTypeChange,
  dateRange,
  onDateRangeChange,
  onRefresh,
  loading = false,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
      <div className="flex items-center gap-2">
        <button
          onClick={() => onChartTypeChange('area')}
          className={`p-2 rounded-lg transition-colors ${
            chartType === 'area'
              ? 'bg-red-100 text-red-600'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          title="Area Chart"
        >
          <FaChartArea className="w-4 h-4" />
        </button>
        <button
          onClick={() => onChartTypeChange('line')}
          className={`p-2 rounded-lg transition-colors ${
            chartType === 'line'
              ? 'bg-red-100 text-red-600'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          title="Line Chart"
        >
          <FaChartLine className="w-4 h-4" />
        </button>
        <button
          onClick={() => onChartTypeChange('bar')}
          className={`p-2 rounded-lg transition-colors ${
            chartType === 'bar'
              ? 'bg-red-100 text-red-600'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          title="Bar Chart"
        >
          <FaChartBar className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => onDateRangeChange({ ...dateRange, start: e.target.value })}
            className="text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-200"
          />
          <span className="text-xs text-gray-400">to</span>
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => onDateRangeChange({ ...dateRange, end: e.target.value })}
            className="text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-200"
          />
        </div>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="px-4 py-2 bg-red-600 text-white text-xs font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Loading...</span>
            </>
          ) : (
            'Apply'
          )}
        </button>
      </div>
    </div>
  );
};

export default ChartControls;