// import React from "react";
// import { NavLink, useNavigate } from "react-router-dom";
// import {
//   FaChartLine,
//   FaCoffee,
//   FaShoppingBag,
//   FaFileAlt,
//   FaCog,
//   FaSignOutAlt,
// } from "react-icons/fa";
// import { useAuth } from "../../auth/useAuth";
// import VelvetaLogo from "../../assets/icon/velveta.png";
// interface AdminSidebarProps {
//   ordersCount?: number; // 
//   onBackToHome?: () => void;
// }

// const AdminSidebar: React.FC<AdminSidebarProps> = ({
//   ordersCount = 0,
//   onBackToHome,
// }) => {
//   const { logout } = useAuth();
//   const navigate = useNavigate();

//   const handleBackToHome = () => {
//     if (onBackToHome) {
//       onBackToHome();
//     } else {
//       navigate("/"); // Redirect ke home user
//     }
//   };

//   const menuItems = [
//     {
//       path: "/admin/dashboard",
//       icon: FaChartLine,
//       label: "Dashboard",
//     },
//     {
//       path: "/admin/menus",
//       icon: FaCoffee,
//       label: "Menus",
//     },
//     {
//       path: "/admin/orders",
//       icon: FaShoppingBag,
//       label: "Orders",
//       hasBadge: true,
//       badgeCount: ordersCount,
//     },
//     {
//       path: "/admin/reports",
//       icon: FaFileAlt,
//       label: "Reports",
//     },
//     {
//       path: "/admin/settings",
//       icon: FaCog,
//       label: "Settings",
//     },
//   ];

//   return (
//     <aside className="">
//       <div className="p-6">
//         {/* Logo Section - Mirip dengan DashboardSidebar */}
//         <div className="mb-6 flex items-center justify-center">
//           <img src={VelvetaLogo} alt="Velveta Logo" className="h-14" />
//         </div>

//         {/* Back to Home Button - Sama persis dengan DashboardSidebar */}
//         {/* <div className="mb-8 pb-6 border-b border-gray-100">
//           <button
//             onClick={handleBackToHome}
//             className="flex items-center space-x-2 text-gray-700 hover:text-red-700 hover:bg-red-50 px-4 py-3 rounded-lg transition-all duration-300 w-full text-left group border border-gray-200 hover:border-red-200"
//           >
//             <svg
//               className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform duration-300"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M10 19l-7-7m0 0l7-7m-7 7h18"
//               />
//             </svg>
//             <span className="font-medium">Back to Home</span>
//           </button>
//         </div> */}

//         {/* Navigation Menu - Style DashboardSidebar */}
//         <nav className="space-y-1">
//           {menuItems.map((item) => {
//             const Icon = item.icon;

//             return (
//               <NavLink
//                 key={item.path}
//                 to={item.path}
//                 className={({ isActive }) =>
//                   `flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-50 hover:text-red-700 transition-all duration-300 w-full text-left ${
//                     isActive
//                       ? "bg-red-50 text-red-700 border-l-4 border-red-500"
//                       : "text-gray-700 border-l-4 border-transparent"
//                   }`
//                 }
//               >
//                 {({ isActive }) => (
//                   <>
//                     <div className={isActive ? "text-red-600" : "text-gray-500"}>
//                       <Icon className="w-5 h-5" />
//                     </div>

//                     <span className="font-medium">{item.label}</span>

//                     {item.hasBadge && item.badgeCount > 0 && (
//                       <span
//                         className={`ml-auto text-xs font-medium px-2 py-1 rounded-full ${
//                           isActive
//                             ? "bg-red-600 text-white"
//                             : "bg-red-100 text-red-800"
//                         }`}
//                       >
//                         {item.badgeCount}
//                       </span>
//                     )}
//                   </>
//                 )}
//               </NavLink>
//             );
//           })}
//         </nav>

//         {/* Logout Button - Mirip dengan DashboardSidebar style */}
//         <div className="mt-8 pt-6 border-t border-gray-200">
//           <button
//             onClick={logout}
//             className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-50 hover:text-red-700 transition-all duration-300 w-full text-left group border border-gray-200 hover:border-red-200"
//           >
//             <div className="text-gray-500 group-hover:text-red-600">
//               <FaSignOutAlt className="w-5 h-5" />
//             </div>
//             <span className="font-medium text-gray-700 group-hover:text-red-700">
//               Logout
//             </span>
//           </button>
//         </div>
//       </div>
//     </aside>
//   );
// };

// export default AdminSidebar;