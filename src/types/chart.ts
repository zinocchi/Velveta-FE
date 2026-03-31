export type ChartType = 'line' | 'area' | 'bar';

export interface DateRange {
  start: string;
  end: string;
}

export interface ChartDataPoint {
  date: string;
  revenue: number;
  orders: number;
}