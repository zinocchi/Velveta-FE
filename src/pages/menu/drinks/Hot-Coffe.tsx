import { useEffect, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import MenuCard from "../../../components/menu/MenuCard";
import menuService from "../../../services/MenuServices";
import type { Menu } from "../../../types/index";
import MenuSidebar from "../../../components/MenuSidebar";
import { ChevronLeft } from "lucide-react";
import "../../../Menu.css";

const HotCoffe = () => {
  const [menuData, setMenuData] = useState<Menu[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

useEffect(() => {
    fetchMenuData();
  }, []);

  const fetchMenuData = async () => {
    try {
      setLoading(true);

      const data = await menuService.getMenuByCategory("hot-coffee");
      console.log("Fetched menu data:", data);

      setMenuData(data);
    } catch (error) {
      console.error("Error fetching hot coffee menu data:", error);
    } finally {
      setLoading(false);
    }
  };



  if (loading) {
    return <div className="p-4 md:p-8 lg:p-12">Loading...</div>;
  }

  return (
    <div className="p-4 md:p-8 lg:p-12">
      <div className="mb-6 flex items-center">
        <Link to="/menu/drinks" className="mr-2">
          <ChevronLeft className="h-6 w-6" />
        </Link>
        <h1 className="text-2xl font-bold">Hot Coffee</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuData.map((item) => (
          <MenuCard key={item.id} menu={item} />
        ))}
      </div>
    </div>
  );
};


export default HotCoffe;