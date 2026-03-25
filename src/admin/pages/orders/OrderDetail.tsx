// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   FaArrowLeft,
//   FaMotorcycle,
//   FaStore,
//   FaUser,
//   FaEnvelope,
//   FaMapMarkerAlt,
//   FaPhone,
//   FaCity,
//   FaClock,
//   FaCalendarAlt,
//   FaBox,
//   FaCreditCard,
//   FaMoneyBillWave,
//   FaWallet,
//   FaUniversity,
//   FaCheckCircle,
//   FaTimesCircle,
//   FaSpinner,
//   FaHourglassHalf,
//   FaHistory,
//   FaReceipt, // Tambahkan icon receipt
// } from "react-icons/fa";
// import { SiMastercard, SiVisa } from "react-icons/si";
// import api from "../../../api/axios";
// import type { Order } from "../../types/index";
// import OrderStatusBadge from "./components/OrderStatusBadges";
// import ReceiptModal from "../../components/ReceiptModal"; // Import komponen receipt

// interface OrderDetailProps {
//   orderId: number;
//   onStatusUpdate: (orderId: number, status: string) => void;
// }

// interface ExtendedOrder extends Order {
//   payment_details?: {
//     card_last4?: string;
//     card_brand?: string;
//     provider?: string;
//     phone?: string;
//     bank?: string;
//   };
//   e_wallet_provider?: string;
//   bank_code?: string;
//   card_last4?: string;
//   completed_at?: string;
//   processing_at?: string;
//   cancelled_at?: string;
//   estimated_minutes?: number;
// }

// const OrderDetail: React.FC<OrderDetailProps> = ({ orderId, onStatusUpdate }) => {
//   const navigate = useNavigate();
//   const [order, setOrder] = useState<ExtendedOrder | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [updating, setUpdating] = useState(false);
  
//   // State untuk receipt modal
//   const [showReceipt, setShowReceipt] = useState(false);
  
//   // State untuk konfirmasi
//   const [showConfirm, setShowConfirm] = useState<{
//     show: boolean;
//     newStatus: string;
//   }>({
//     show: false,
//     newStatus: ""
//   });

//   useEffect(() => {
//     fetchOrderDetail();
//   }, [orderId]);

//   const fetchOrderDetail = async () => {
//     try {
//       setLoading(true);
//       const response = await api.get(`/admin/orders/${orderId}`);
//       setOrder(response.data.data);
//     } catch (error) {
//       console.error("Failed to fetch order detail:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleStatusClick = (status: string) => {
//     setShowConfirm({
//       show: true,
//       newStatus: status
//     });
//   };

//   const handleStatusConfirm = async () => {
//     if (!showConfirm.newStatus) return;
    
//     setUpdating(true);
//     setShowConfirm({ show: false, newStatus: "" });
    
//     try {
//       // Panggil onStatusUpdate dari props
//       await onStatusUpdate(orderId, showConfirm.newStatus);
//       // Refresh data order
//       await fetchOrderDetail();
//     } catch (error) {
//       console.error("Failed to update status:", error);
//     } finally {
//       setUpdating(false);
//     }
//   };

//   const handleStatusCancel = () => {
//     setShowConfirm({ show: false, newStatus: "" });
//   };

//   const formatCurrency = (amount: number) => {
//     return new Intl.NumberFormat("id-ID", {
//       style: "currency",
//       currency: "IDR",
//       minimumFractionDigits: 0,
//     }).format(amount);
//   };

//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString("id-ID", {
//       day: "numeric",
//       month: "long",
//       year: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   const formatTime = (dateString: string) => {
//     const date = new Date(dateString);
//     return date.toLocaleTimeString("id-ID", {
//       hour: "2-digit",
//       minute: "2-digit",
//       second: "2-digit",
//     });
//   };

//   const calculateDuration = (startDate: string, endDate: string) => {
//     const start = new Date(startDate).getTime();
//     const end = new Date(endDate).getTime();
//     const durationMs = end - start;
    
//     const minutes = Math.floor(durationMs / 60000);
//     const hours = Math.floor(minutes / 60);
//     const remainingMinutes = minutes % 60;
    
//     if (hours > 0) {
//       return `${hours}h ${remainingMinutes}m`;
//     }
//     return `${minutes}m`;
//   };

//   const getPaymentMethodIcon = (method: string | undefined) => {
//     if (!method) return <FaMoneyBillWave className="w-4 h-4 text-gray-600" />;
    
//     const methodLower = method.toLowerCase();
//     switch (methodLower) {
//       case "credit_card":
//         return <FaCreditCard className="w-4 h-4 text-blue-600" />;
//       case "e_wallet":
//         return <FaWallet className="w-4 h-4 text-purple-600" />;
//       case "bank_transfer":
//         return <FaUniversity className="w-4 h-4 text-emerald-600" />;
//       default:
//         return <FaMoneyBillWave className="w-4 h-4 text-gray-600" />;
//     }
//   };

//   const getPaymentMethodName = (method: string | undefined) => {
//     if (!method) return "Cash";
    
//     const methods: Record<string, string> = {
//       credit_card: "Credit Card",
//       e_wallet: "E-Wallet",
//       bank_transfer: "Bank Transfer",
//     };
//     return methods[method.toLowerCase()] || method.replace("_", " ");
//   };

//   const getEWalletIcon = (provider?: string) => {
//     if (!provider) return null;
//     const providerLower = provider.toLowerCase();
//     switch (providerLower) {
//       case "ovo":
//         return <span className="text-blue-600 font-bold">OVO</span>;
//       case "gopay":
//         return <span className="text-green-600 font-bold">GoPay</span>;
//       case "dana":
//         return <span className="text-blue-500 font-bold">DANA</span>;
//       default:
//         return <span>{provider}</span>;
//     }
//   };

//   const getCardBrandIcon = (brand?: string) => {
//     if (!brand) return null;
//     const brandLower = brand.toLowerCase();
//     switch (brandLower) {
//       case "visa":
//         return <SiVisa className="w-5 h-5 text-blue-600" />;
//       case "mastercard":
//         return <SiMastercard className="w-5 h-5 text-orange-600" />;
//       default:
//         return null;
//     }
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "PENDING":
//         return "bg-yellow-100 text-yellow-700 border-yellow-200";
//       case "PROCESSING":
//         return "bg-blue-100 text-blue-700 border-blue-200";
//       case "COMPLETED":
//         return "bg-green-100 text-green-700 border-green-200";
//       case "CANCELLED":
//         return "bg-red-100 text-red-700 border-red-200";
//       default:
//         return "bg-gray-100 text-gray-700 border-gray-200";
//     }
//   };

//   const isCompleted = order?.status === "COMPLETED";
//   const isCancelled = order?.status === "CANCELLED";

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-red-700"></div>
//           <p className="mt-4 text-gray-600">Loading order details...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!order) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <FaBox className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//           <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
//           <p className="text-gray-500 mb-6">The order you're looking for doesn't exist.</p>
//           <button
//             onClick={() => navigate("/admin/orders")}
//             className="px-6 py-3 bg-red-700 text-white rounded-xl font-medium hover:bg-red-800 transition-colors"
//           >
//             Back to Orders
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       {/* Confirmation Modal */}
//       {showConfirm.show && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//           <div
//             className="absolute inset-0 bg-black/40 backdrop-blur-sm"
//             onClick={handleStatusCancel}
//           />
//           <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-fadeIn">
//             <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
//               showConfirm.newStatus === "CANCELLED" ? "bg-red-100" :
//               showConfirm.newStatus === "COMPLETED" ? "bg-green-100" :
//               "bg-blue-100"
//             }`}>
//               {showConfirm.newStatus === "CANCELLED" && <FaTimesCircle className="w-8 h-8 text-red-600" />}
//               {showConfirm.newStatus === "COMPLETED" && <FaCheckCircle className="w-8 h-8 text-green-600" />}
//               {showConfirm.newStatus === "PROCESSING" && <FaSpinner className="w-8 h-8 text-blue-600 animate-spin" />}
//             </div>
            
//             <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
//               Confirm Status Update
//             </h3>
            
//             <p className="text-gray-600 text-center mb-6">
//               Are you sure you want to change this order status<br />
//               from <span className={`px-2 py-0.5 rounded-full text-sm ${getStatusColor(order.status)}`}>
//                 {order.status}
//               </span> to <span className={`px-2 py-0.5 rounded-full text-sm ${getStatusColor(showConfirm.newStatus)}`}>
//                 {showConfirm.newStatus}
//               </span>?
//             </p>

//             {showConfirm.newStatus === "CANCELLED" && (
//               <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
//                 <p className="text-sm text-yellow-700 flex items-center gap-2">
//                   <FaTimesCircle className="w-4 h-4 flex-shrink-0" />
//                   Cancelling this order will restore stock for all items.
//                 </p>
//               </div>
//             )}

//             {showConfirm.newStatus === "COMPLETED" && (
//               <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6">
//                 <p className="text-sm text-green-700 flex items-center gap-2">
//                   <FaCheckCircle className="w-4 h-4 flex-shrink-0" />
//                   Marking as completed will finalize this order.
//                 </p>
//               </div>
//             )}

//             <div className="flex gap-3">
//               <button
//                 onClick={handleStatusCancel}
//                 disabled={updating}
//                 className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleStatusConfirm}
//                 disabled={updating}
//                 className={`flex-1 px-4 py-3 rounded-xl text-white font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2 ${
//                   showConfirm.newStatus === "CANCELLED" ? "bg-red-600 hover:bg-red-700" :
//                   showConfirm.newStatus === "COMPLETED" ? "bg-green-600 hover:bg-green-700" :
//                   "bg-blue-600 hover:bg-blue-700"
//                 }`}
//               >
//                 {updating ? (
//                   <>
//                     <FaSpinner className="w-4 h-4 animate-spin" />
//                     Updating...
//                   </>
//                 ) : (
//                   "Confirm"
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Receipt Modal */}
//       <ReceiptModal
//         isOpen={showReceipt}
//         onClose={() => setShowReceipt(false)}
//         order={order}
//       />

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header dengan Back Button dan Receipt Button */}
//         <div className="flex items-center justify-between mb-6">
//           <button
//             onClick={() => navigate("/admin/orders")}
//             className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group"
//           >
//             <div className="p-2 rounded-lg bg-white shadow-sm group-hover:bg-gray-50 transition-colors">
//               <FaArrowLeft className="w-4 h-4" />
//             </div>
//             <span className="font-medium">Back to Orders</span>
//           </button>

//           {/* Receipt Button */}
//           <button
//             onClick={() => setShowReceipt(true)}
//             className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
//           >
//             <FaReceipt className="w-4 h-4 text-gray-500" />
//             <span className="font-medium">View Receipt</span>
//           </button>
//         </div>

//         {/* Header Card */}
//         <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
//           <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//             <div className="flex items-start gap-4">
//               <div className="p-3 bg-red-50 rounded-xl">
//                 <FaBox className="w-6 h-6 text-red-700" />
//               </div>
//               <div>
//                 <div className="flex items-center gap-3 mb-1">
//                   <h1 className="text-2xl font-bold text-gray-900">
//                     Order #{order.order_number}
//                   </h1>
//                   <OrderStatusBadge status={order.status} size="md" />
//                 </div>
//                 <div className="flex items-center gap-4 text-sm text-gray-500">
//                   <span className="flex items-center gap-1">
//                     <FaCalendarAlt className="w-4 h-4" />
//                     {formatDate(order.created_at)}
//                   </span>
//                   <span className="flex items-center gap-1">
//                     {order.delivery_type === "delivery" ? (
//                       <FaMotorcycle className="w-4 h-4" />
//                     ) : (
//                       <FaStore className="w-4 h-4" />
//                     )}
//                     <span className="capitalize">{order.delivery_type}</span>
//                   </span>
//                 </div>
//               </div>
//             </div>
            
//             {/* Order Total */}
//             <div className="text-right">
//               <p className="text-sm text-gray-500 mb-1">Total Amount</p>
//               <p className="text-3xl font-bold text-red-700">
//                 {formatCurrency(order.total_price)}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Status Update Buttons - Disable if COMPLETED or CANCELLED */}
//         {!isCompleted && !isCancelled && (
//           <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Order Status</h3>
//             <div className="flex flex-wrap gap-3">
//               <button
//                 onClick={() => handleStatusClick("PROCESSING")}
//                 disabled={order.status === "PROCESSING" || updating || isCompleted || isCancelled}
//                 className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 ${
//                   order.status === "PROCESSING"
//                     ? "bg-blue-100 text-blue-700 cursor-not-allowed"
//                     : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow"
//                 } disabled:opacity-50 disabled:cursor-not-allowed`}
//               >
//                 <FaClock className="w-4 h-4" />
//                 Mark as Processing
//               </button>
              
//               <button
//                 onClick={() => handleStatusClick("COMPLETED")}
//                 disabled={order.status === "COMPLETED" || updating || isCompleted || isCancelled}
//                 className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 ${
//                   order.status === "COMPLETED"
//                     ? "bg-green-100 text-green-700 cursor-not-allowed"
//                     : "bg-green-600 text-white hover:bg-green-700 shadow-sm hover:shadow"
//                 } disabled:opacity-50 disabled:cursor-not-allowed`}
//               >
//                 <FaCheckCircle className="w-4 h-4" />
//                 Mark as Completed
//               </button>
              
//               <button
//                 onClick={() => handleStatusClick("CANCELLED")}
//                 disabled={order.status === "CANCELLED" || updating || isCompleted || isCancelled}
//                 className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 ${
//                   order.status === "CANCELLED"
//                     ? "bg-red-100 text-red-700 cursor-not-allowed"
//                     : "bg-red-600 text-white hover:bg-red-700 shadow-sm hover:shadow"
//                 } disabled:opacity-50 disabled:cursor-not-allowed`}
//               >
//                 <FaTimesCircle className="w-4 h-4" />
//                 Cancel Order
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Order Timeline - Show if COMPLETED */}
//         {(isCompleted || order.processing_at || order.completed_at) && (
//           <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
//               <FaHistory className="w-5 h-5 text-gray-500" />
//               Order Timeline
//             </h3>
//             <div className="space-y-4">
//               {/* Created At */}
//               <div className="flex items-start gap-3">
//                 <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
//                   <FaCalendarAlt className="w-4 h-4 text-gray-600" />
//                 </div>
//                 <div className="flex-1">
//                   <p className="text-sm font-medium text-gray-900">Order Created</p>
//                   <p className="text-sm text-gray-500">{formatDate(order.created_at)}</p>
//                 </div>
//               </div>

//               {/* Processing At */}
//               {order.processing_at && (
//                 <div className="flex items-start gap-3">
//                   <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
//                     <FaClock className="w-4 h-4 text-blue-600" />
//                   </div>
//                   <div className="flex-1">
//                     <p className="text-sm font-medium text-gray-900">Order Processed</p>
//                     <p className="text-sm text-gray-500">{formatDate(order.processing_at)}</p>
//                   </div>
//                 </div>
//               )}

//               {/* Completed At */}
//               {order.completed_at && (
//                 <div className="flex items-start gap-3">
//                   <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
//                     <FaCheckCircle className="w-4 h-4 text-green-600" />
//                   </div>
//                   <div className="flex-1">
//                     <p className="text-sm font-medium text-gray-900">Order Completed</p>
//                     <p className="text-sm text-gray-500">{formatDate(order.completed_at)}</p>
//                   </div>
//                 </div>
//               )}

//               {/* Cancelled At */}
//               {order.cancelled_at && (
//                 <div className="flex items-start gap-3">
//                   <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
//                     <FaTimesCircle className="w-4 h-4 text-red-600" />
//                   </div>
//                   <div className="flex-1">
//                     <p className="text-sm font-medium text-gray-900">Order Cancelled</p>
//                     <p className="text-sm text-gray-500">{formatDate(order.cancelled_at)}</p>
//                   </div>
//                 </div>
//               )}

//               {/* Duration Summary - Show if completed */}
//               {order.completed_at && order.processing_at && (
//                 <div className="mt-4 pt-4 border-t border-gray-100">
//                   <div className="bg-gray-50 rounded-xl p-4">
//                     <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
//                       <FaHourglassHalf className="w-4 h-4 text-gray-500" />
//                       Processing Duration
//                     </p>
//                     <div className="grid grid-cols-2 gap-4">
//                       <div>
//                         <p className="text-xs text-gray-500">Processing Time</p>
//                         <p className="text-lg font-semibold text-gray-900">
//                           {calculateDuration(order.processing_at, order.completed_at)}
//                         </p>
//                       </div>
//                       <div>
//                         <p className="text-xs text-gray-500">Completed At</p>
//                         <p className="text-sm font-medium text-gray-900">
//                           {formatTime(order.completed_at)}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}

//         {/* Order Details Grid */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Order Items - Left Column */}
//           <div className="lg:col-span-2 space-y-6">
//             {/* Items Card */}
//             <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
//               <div className="p-6 border-b border-gray-100">
//                 <h3 className="text-lg font-semibold text-gray-900">Order Items</h3>
//               </div>
              
//               <div className="divide-y divide-gray-100">
//                 {order.items.map((item) => (
//                   <div key={item.id} className="p-6 hover:bg-gray-50/50 transition-colors">
//                     <div className="flex items-center gap-4">
//                       {/* Item Image */}
//                       <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
//                         {item.menu.image_url ? (
//                           <img
//                             src={item.menu.image_url}
//                             alt={item.menu.name}
//                             className="w-full h-full object-cover"
//                           />
//                         ) : (
//                           <div className="w-full h-full flex items-center justify-center">
//                             <FaBox className="w-6 h-6 text-gray-400" />
//                           </div>
//                         )}
//                       </div>

//                       {/* Item Details */}
//                       <div className="flex-1">
//                         <h4 className="font-semibold text-gray-900 mb-1">
//                           {item.menu.name}
//                         </h4>
//                         <div className="flex items-center gap-3 text-sm">
//                           <span className="text-gray-500">
//                             {formatCurrency(item.price)} × {item.qty}
//                           </span>
//                           <span className="text-gray-300">|</span>
//                           <span className="font-medium text-gray-900">
//                             {formatCurrency(item.price * item.qty)}
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {/* Order Summary */}
//               <div className="p-6 bg-gray-50/50 border-t border-gray-100">
//                 <div className="space-y-2">
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-600">Subtotal</span>
//                     <span className="font-medium text-gray-900">
//                       {formatCurrency(order.total_price - (order.shipping_cost || 0))}
//                     </span>
//                   </div>
//                   {order.shipping_cost > 0 && (
//                     <div className="flex justify-between text-sm">
//                       <span className="text-gray-600">Shipping Cost</span>
//                       <span className="font-medium text-gray-900">
//                         {formatCurrency(order.shipping_cost)}
//                       </span>
//                     </div>
//                   )}
//                   <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-200">
//                     <span className="text-gray-900">Total</span>
//                     <span className="text-red-700 text-xl">
//                       {formatCurrency(order.total_price)}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Right Column - Customer & Delivery Info */}
//           <div className="space-y-6">
//             {/* Customer Info Card */}
//             <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
//               <div className="p-4 bg-gray-50/50 border-b border-gray-100">
//                 <h3 className="font-semibold text-gray-900 flex items-center gap-2">
//                   <FaUser className="w-4 h-4 text-gray-500" />
//                   Customer Information
//                 </h3>
//               </div>
//               <div className="p-4 space-y-3">
//                 <div>
//                   <p className="text-xs text-gray-500 mb-1">Username</p>
//                   <p className="font-medium text-gray-900">{order.user?.username || "N/A"}</p>
//                 </div>
//                 <div>
//                   <p className="text-xs text-gray-500 mb-1">Email Address</p>
//                   <p className="font-medium text-gray-900">{order.user?.email || "N/A"}</p>
//                 </div>
//               </div>
//             </div>

//             {/* Delivery Info Card */}
//             <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
//               <div className="p-4 bg-gray-50/50 border-b border-gray-100">
//                 <h3 className="font-semibold text-gray-900 flex items-center gap-2">
//                   {order.delivery_type === "delivery" ? (
//                     <FaMotorcycle className="w-4 h-4 text-gray-500" />
//                   ) : (
//                     <FaStore className="w-4 h-4 text-gray-500" />
//                   )}
//                   Delivery Information
//                 </h3>
//               </div>
//               <div className="p-4 space-y-3">
//                 <div>
//                   <p className="text-xs text-gray-500 mb-1">Method</p>
//                   <p className="font-medium text-gray-900 capitalize">
//                     {order.delivery_type}
//                   </p>
//                 </div>

//                 {order.delivery_type === "delivery" && order.shipping_address && (
//                   <>
//                     <div>
//                       <p className="text-xs text-gray-500 mb-1">Recipient</p>
//                       <p className="font-medium text-gray-900">
//                         {order.shipping_address.recipient_name || "N/A"}
//                       </p>
//                     </div>
//                     <div>
//                       <p className="text-xs text-gray-500 mb-1">Phone Number</p>
//                       <p className="font-medium text-gray-900">
//                         {order.shipping_address.phone_number || "N/A"}
//                       </p>
//                     </div>
//                     <div>
//                       <p className="text-xs text-gray-500 mb-1">Address</p>
//                       <p className="font-medium text-gray-900">
//                         {order.shipping_address.address || "N/A"}
//                       </p>
//                       {order.shipping_address.detail && (
//                         <p className="text-sm text-gray-600 mt-1">{order.shipping_address.detail}</p>
//                       )}
//                     </div>
//                     <div className="grid grid-cols-2 gap-3">
//                       <div>
//                         <p className="text-xs text-gray-500 mb-1">City</p>
//                         <p className="font-medium text-gray-900">
//                           {order.shipping_address.city || "N/A"}
//                         </p>
//                       </div>
//                       <div>
//                         <p className="text-xs text-gray-500 mb-1">Postal Code</p>
//                         <p className="font-medium text-gray-900">
//                           {order.shipping_address.postal_code || "N/A"}
//                         </p>
//                       </div>
//                     </div>
//                   </>
//                 )}

//                 {order.estimated_minutes && (
//                   <div>
//                     <p className="text-xs text-gray-500 mb-1">Est. Preparation Time</p>
//                     <p className="font-medium text-gray-900 flex items-center gap-1">
//                       <FaClock className="w-4 h-4 text-gray-400" />
//                       {order.estimated_minutes} minutes
//                     </p>
//                   </div>
//                 )}

//                 {!order.shipping_address && order.delivery_type === "pickup" && (
//                   <div>
//                     <p className="text-xs text-gray-500 mb-1">Pickup Location</p>
//                     <p className="font-medium text-gray-900">
//                       Velveta Coffee - Jl. Sudirman No. 123, Jakarta Pusat
//                     </p>
//                     <p className="text-xs text-gray-500 mt-1">
//                       Please bring your order number for pickup
//                     </p>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Payment Info Card */}
//             <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
//               <div className="p-4 bg-gray-50/50 border-b border-gray-100">
//                 <h3 className="font-semibold text-gray-900 flex items-center gap-2">
//                   <FaCreditCard className="w-4 h-4 text-gray-500" />
//                   Payment Information
//                 </h3>
//               </div>
//               <div className="p-4 space-y-4">
//                 {/* Payment Method */}
//                 <div className="flex items-center gap-3">
//                   <div className="p-2 bg-gray-100 rounded-lg">
//                     {getPaymentMethodIcon(order.payment_method)}
//                   </div>
//                   <div className="flex-1">
//                     <p className="text-xs text-gray-500 mb-1">Payment Method</p>
//                     <p className="font-medium text-gray-900">
//                       {getPaymentMethodName(order.payment_method)}
//                     </p>
//                   </div>
//                 </div>

//                 {/* Payment Details based on method */}
//                 {order.payment_method === "e_wallet" && (
//                   <div className="bg-purple-50/50 p-3 rounded-lg border border-purple-100">
//                     <div className="space-y-2">
//                       <div className="flex items-center justify-between">
//                         <span className="text-xs text-gray-500">Provider</span>
//                         <div className="flex items-center gap-2">
//                           {getEWalletIcon(order.e_wallet_provider || order.payment_details?.provider)}
//                           <span className="text-sm font-medium text-gray-900">
//                             {order.e_wallet_provider || order.payment_details?.provider || "N/A"}
//                           </span>
//                         </div>
//                       </div>
//                       {order.payment_details?.phone && (
//                         <div className="flex items-center justify-between">
//                           <span className="text-xs text-gray-500">Phone Number</span>
//                           <span className="text-sm font-medium text-gray-900">
//                             {order.payment_details.phone}
//                           </span>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 )}

//                 {order.payment_method === "bank_transfer" && (
//                   <div className="bg-emerald-50/50 p-3 rounded-lg border border-emerald-100">
//                     <div className="space-y-2">
//                       <div className="flex justify-between">
//                         <span className="text-xs text-gray-500">Bank</span>
//                         <span className="text-sm font-medium text-gray-900 uppercase">
//                           {order.bank_code || order.payment_details?.bank || "N/A"}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {order.payment_method === "credit_card" && (order.card_last4 || order.payment_details?.card_last4) && (
//                   <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-100">
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center gap-2">
//                         {getCardBrandIcon(order.payment_details?.card_brand)}
//                         <span className="text-sm font-medium text-gray-700">
//                           •••• •••• •••• {order.card_last4 || order.payment_details?.card_last4}
//                         </span>
//                       </div>
//                       {order.payment_details?.card_brand && (
//                         <span className="text-xs text-gray-500">
//                           {order.payment_details.card_brand}
//                         </span>
//                       )}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Animation styles */}
//       <style>{`
//         @keyframes fadeIn {
//           from {
//             opacity: 0;
//             transform: scale(0.95);
//           }
//           to {
//             opacity: 1;
//             transform: scale(1);
//           }
//         }
//         .animate-fadeIn {
//           animation: fadeIn 0.2s ease-out;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default OrderDetail;