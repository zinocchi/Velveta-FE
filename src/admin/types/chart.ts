// src/admin/types/chart.ts

/**
 * Chart type options
 */
export type ChartType = 'area' | 'line' | 'bar';

/**
 * Chart data point structure
 */
export interface ChartDataPoint {
  date: string;
  revenue: number;
  orders: number;
  [key: string]: any; // For additional fields
}

/**
 * Date range for filtering
 */
export interface DateRange {
  start: string;
  end: string;
}

/**
 * Chart dataset for multiple series
 */
export interface ChartDataset {
  label: string;
  data: number[];
  color: string;
  borderColor?: string;
  backgroundColor?: string;
  fill?: boolean;
}

/**
 * Chart configuration options
 */
export interface ChartOptions {
  responsive?: boolean;
  maintainAspectRatio?: boolean;
  height?: number;
  width?: number;
  showLegend?: boolean;
  showGrid?: boolean;
  showTooltip?: boolean;
  animate?: boolean;
}

/**
 * Chart tooltip data
 */
export interface ChartTooltipData {
  active: boolean;
  payload: any[];
  label: string;
  value?: number;
}

/**
 * Chart legend item
 */
export interface ChartLegendItem {
  id: string;
  label: string;
  color: string;
  active: boolean;
}

/**
 * Chart control configuration
 */
export interface ChartControlConfig {
  chartType: ChartType;
  dateRange: DateRange;
  showExport?: boolean;
  showRefresh?: boolean;
  showDateRange?: boolean;
}

/**
 * Chart filter options
 */
export interface ChartFilters {
  dateRange: DateRange;
  chartType: ChartType;
  groupBy?: 'day' | 'week' | 'month';
}

/**
 * Chart export options
 */
export interface ChartExportOptions {
  format: 'csv' | 'png' | 'svg';
  filename: string;
  includeData?: boolean;
}