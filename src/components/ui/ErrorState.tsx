
// import React from 'react';
// import { FaExclamationTriangle, FaRefresh } from 'react-icons/fa';

// interface ErrorStateProps {
//   message?: string;
//   onRetry?: () => void;
//   title?: string;
// }

// const ErrorState: React.FC<ErrorStateProps> = ({
//   message = 'Something went wrong',
//   onRetry,
//   title = 'Error',
// }) => {
//   return (
//     <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
//       <div className="text-center max-w-md">
//         <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
//           <FaExclamationTriangle className="w-10 h-10 text-red-600" />
//         </div>
//         <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
//         <p className="text-gray-500 mb-6">{message}</p>
//         {onRetry && (
//           <button
//             onClick={onRetry}
//             className="inline-flex items-center gap-2 px-6 py-3 bg-red-700 text-white rounded-xl font-medium hover:bg-red-800 transition-colors shadow-sm hover:shadow"
//           >
//             <FaRefresh className="w-4 h-4" />
//             Try Again
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ErrorState;