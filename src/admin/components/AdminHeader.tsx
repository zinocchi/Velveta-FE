import { useAuth } from "../../hooks/useAuth";
import { FaUserCircle, FaBell } from "react-icons/fa";

const AdminHeader = () => {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between">
      <div className="flex-1" />
      
      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
          <FaBell className="w-5 h-5 text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full"></span>
        </button>
        
        <div className="flex items-center gap-3">
          <FaUserCircle className="w-8 h-8 text-gray-400" />
          <div>
            <p className="text-sm font-medium text-gray-900">{user?.username || "Admin"}</p>
            <p className="text-xs text-gray-500">Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;