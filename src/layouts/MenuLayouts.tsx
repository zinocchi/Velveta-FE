import Navbar from "../components/Navbar";
import MenuSidebar from "../components/menu/MenuSidebar";
import { Outlet } from "react-router-dom";

const MenuLayout = () => {
  return (
    <>
      <Navbar />

      <main className="bg-gray-50 min-h-screen pt-0  ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-10">
          <aside className="w-64 shrink-0">
            <div className="fixed top-24 w-64">
              <MenuSidebar />
            </div>
          </aside>

          <section className="flex-1">
            <Outlet />
          </section>
        </div>
      </main>
    </>
  );
};

export default MenuLayout;
