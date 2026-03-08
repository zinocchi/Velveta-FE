// components/CustomAlert.tsx
import { useEffect } from "react";
import { 
  FaCheckCircle, 
  FaExclamationCircle, 
  FaInfoCircle, 
  FaExclamationTriangle,
  FaTimes 
} from "react-icons/fa";

interface CustomAlertProps {
  show: boolean;
  message: string;
  type: "error" | "warning" | "info" | "success";
  onClose: () => void;
}

const CustomAlert = ({ show, message, type, onClose }: CustomAlertProps) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  const getAlertStyles = () => {
    switch (type) {
      case "success":
        return {
          bg: "bg-green-50",
          border: "border-green-400",
          text: "text-green-800",
          icon: <FaCheckCircle className="w-5 h-5 text-green-400" />,
        };
      case "error":
        return {
          bg: "bg-red-50",
          border: "border-red-400",
          text: "text-red-800",
          icon: <FaExclamationCircle className="w-5 h-5 text-red-400" />,
        };
      case "warning":
        return {
          bg: "bg-yellow-50",
          border: "border-yellow-400",
          text: "text-yellow-800",
          icon: <FaExclamationTriangle className="w-5 h-5 text-yellow-400" />,
        };
      case "info":
      default:
        return {
          bg: "bg-blue-50",
          border: "border-blue-400",
          text: "text-blue-800",
          icon: <FaInfoCircle className="w-5 h-5 text-blue-400" />,
        };
    }
  };

  const styles = getAlertStyles();

  return (
    <div className="fixed top-24 right-4 z-50 animate-slideIn">
      <div className={`${styles.bg} border-l-4 ${styles.border} ${styles.text} p-4 rounded-r-lg shadow-lg max-w-sm`}>
        <div className="flex items-start">
          <div className="flex-shrink-0">{styles.icon}</div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium">{message}</p>
          </div>
          <button
            onClick={onClose}
            className={`ml-4 ${styles.text} hover:opacity-75 focus:outline-none`}>
            <FaTimes className="w-4 h-4" />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default CustomAlert;