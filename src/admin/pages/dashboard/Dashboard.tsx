import { useEffect, useState } from "react";

const Dashboard = () => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");

    if (!token) {
      window.location.href = "/admin/login";
      return;
    }

    fetch("http://localhost:8000/api/admin/dashboard", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((result) => setData(result));
  }, []);

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default Dashboard;