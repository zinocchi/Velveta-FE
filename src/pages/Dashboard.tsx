import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

type User = {
  id: number;
  fullname: string;
  username: string;
  email: string;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/me");
        setUser(res.data.user);
      } catch {
        localStorage.removeItem("token");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      {user && (
        <div className="bg-white p-4 rounded shadow">
          <p><b>Nama:</b> {user.fullname}</p>
          <p><b>Username:</b> {user.username}</p>
          <p><b>Email:</b> {user.email}</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
