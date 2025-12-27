import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

type User = {
  id: number;
  fullname: string;
  username: string;
  email: string;
  role: "admin" | "user";
};



const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/me");
        setUser(res.data);
      } catch (e) {
        console.error("Failed fetch user", e);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/logout");
    } catch (e) {
      console.error("Logout failed", e);
    }

    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* ADMIN */}
      {user?.role === "admin" && (
        <div className="bg-blue-100 p-3 rounded mt-4">
          <p>Admin Panel</p>
        </div>
      )}

      {/* USER */}
      {user?.role === "user" && (
        <div className="bg-green-100 p-3 rounded mt-4">
          <p>User Dashboard</p>
        </div>
      )}

      <button
        onClick={handleLogout}
        className="mt-6 bg-red-500 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
};



export default Dashboard;
