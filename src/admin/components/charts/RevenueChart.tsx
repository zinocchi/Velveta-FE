// // admin/components/charts/RevenueChart.tsx
// import React from 'react';
// import {
//   LineChart,
//   Line,
//   AreaChart,
//   Area,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
// } from 'recharts';
// import type { RevenueData } from '../../types/index';

// interface RevenueChartProps {
//   data: RevenueData[];
//   chartType?: 'line' | 'area' | 'bar';
//   height?: number;
// }

// const CustomTooltip = ({ active, payload, label }: any) => {
//   if (active && payload && payload.length) {
//     return (
//       <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-200">
//         <p className="text-sm font-medium text-gray-900 mb-1">{label}</p>
//         <p className="text-sm text-gray-600">
//           Revenue: <span className="font-semibold text-emerald-600">
//             {new Intl.NumberFormat('id-ID', {
//               style: 'currency',
//               currency: 'IDR',
//               minimumFractionDigits: 0,
//             }).format(payload[0].value)}
//           </span>
//         </p>
//         {payload[1] && (
//           <p className="text-sm text-gray-600">
//             Orders: <span className="font-semibold text-blue-600">{payload[1].value}</span>
//           </p>
//         )}
//       </div>
//     );
//   }
//   return null;
// };

// const RevenueChart: React.FC<RevenueChartProps> = ({ 
//   data, 
//   chartType = 'area',
//   height = 300 
// }) => {
//   if (!data || data.length === 0) {
//     return (
//       <div className="h-full flex items-center justify-center flex-col">
//         <p className="text-gray-400 mb-2">No revenue data available</p>
//         <p className="text-xs text-gray-400">Try selecting a different date range</p>
//       </div>
//     );
//   }

//   const formatYAxis = (value: number) => {
//     if (value >= 1000000) {
//       return `Rp${(value / 1000000).toFixed(1)}M`;
//     }
//     if (value >= 1000) {
//       return `Rp${(value / 1000).toFixed(0)}K`;
//     }
//     return `Rp${value}`;
//   };

//   const renderChart = () => {
//     switch (chartType) {
//       case 'line':
//         return (
//           <LineChart data={data}>
//             <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//             <XAxis 
//               dataKey="day_name" 
//               tick={{ fontSize: 12, fill: '#6B7280' }}
//               axisLine={{ stroke: '#E5E7EB' }}
//             />
//             <YAxis 
//               tickFormatter={formatYAxis}
//               tick={{ fontSize: 12, fill: '#6B7280' }}
//               axisLine={{ stroke: '#E5E7EB' }}
//             />
//             <Tooltip content={<CustomTooltip />} />
//             <Legend />
//             <Line 
//               type="monotone" 
//               dataKey="revenue" 
//               name="Revenue" 
//               stroke="#EF4444" 
//               strokeWidth={2}
//               dot={{ fill: '#EF4444', r: 4 }}
//               activeDot={{ r: 6, fill: '#EF4444' }}
//             />
//             <Line 
//               type="monotone" 
//               dataKey="orders" 
//               name="Orders" 
//               stroke="#3B82F6" 
//               strokeWidth={2}
//               dot={{ fill: '#3B82F6', r: 4 }}
//               activeDot={{ r: 6, fill: '#3B82F6' }}
//             />
//           </LineChart>
//         );

//       case 'bar':
//         return (
//           <BarChart data={data}>
//             <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//             <XAxis 
//               dataKey="day_name" 
//               tick={{ fontSize: 12, fill: '#6B7280' }}
//               axisLine={{ stroke: '#E5E7EB' }}
//             />
//             <YAxis 
//               tickFormatter={formatYAxis}
//               tick={{ fontSize: 12, fill: '#6B7280' }}
//               axisLine={{ stroke: '#E5E7EB' }}
//             />
//             <Tooltip content={<CustomTooltip />} />
//             <Legend />
//             <Bar dataKey="revenue" name="Revenue" fill="#EF4444" radius={[4, 4, 0, 0]} />
//             <Bar dataKey="orders" name="Orders" fill="#3B82F6" radius={[4, 4, 0, 0]} />
//           </BarChart>
//         );

//       case 'area':
//       default:
//         return (
//           <AreaChart data={data}>
//             <defs>
//               <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
//                 <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
//                 <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
//               </linearGradient>
//               <linearGradient id="ordersGradient" x1="0" y1="0" x2="0" y2="1">
//                 <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
//                 <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
//               </linearGradient>
//             </defs>
//             <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//             <XAxis 
//               dataKey="day_name" 
//               tick={{ fontSize: 12, fill: '#6B7280' }}
//               axisLine={{ stroke: '#E5E7EB' }}
//             />
//             <YAxis 
//               tickFormatter={formatYAxis}
//               tick={{ fontSize: 12, fill: '#6B7280' }}
//               axisLine={{ stroke: '#E5E7EB' }}
//             />
//             <Tooltip content={<CustomTooltip />} />
//             <Legend />
//             <Area 
//               type="monotone" 
//               dataKey="revenue" 
//               name="Revenue" 
//               stroke="#EF4444" 
//               strokeWidth={2}
//               fill="url(#revenueGradient)" 
//             />
//             <Area 
//               type="monotone" 
//               dataKey="orders" 
//               name="Orders" 
//               stroke="#3B82F6" 
//               strokeWidth={2}
//               fill="url(#ordersGradient)" 
//             />
//           </AreaChart>
//         );
//     }
//   };

//   return (
//     <ResponsiveContainer width="100%" height={height}>
//       {renderChart()}
//     </ResponsiveContainer>
//   );
// };

// export default RevenueChart;