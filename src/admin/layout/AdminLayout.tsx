import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div>
      <h1>Admin Panel</h1>
      <hr />
      <Outlet />
    </div>
  );
};

export default AdminLayout;