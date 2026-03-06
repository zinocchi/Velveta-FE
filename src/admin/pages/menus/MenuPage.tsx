import React, { useState, useEffect } from "react";
import api from "../../../api/axios";
import type { Menu, MenuFormData } from "../../types";
import MenuList from "./MenuList";
import MenuForm from "./MenuForm";

const MenuPage: React.FC = () => {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingMenu, setEditingMenu] = useState<Menu | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchMenus();
    fetchCategories();
  }, [search, category]);

  const fetchMenus = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (category !== "all") params.append("category", category);

      const response = await api.get(`/admin/menus?${params.toString()}`);
      setMenus(response.data.data.data || response.data.data);
    } catch (error) {
      console.error("Failed to fetch menus:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get("/admin/categories");
      setCategories(response.data.data.map((c: any) => c.category));
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this menu?")) return;
    try {
      await api.delete(`/admin/menus/${id}`);
      fetchMenus();
    } catch (error) {
      console.error("Failed to delete menu:", error);
    }
  };

  const handleToggleAvailability = async (id: number) => {
    try {
      await api.patch(`/admin/menus/${id}/toggle-availability`);
      fetchMenus();
    } catch (error) {
      console.error("Failed to toggle availability:", error);
    }
  };

  const handleUpdateStock = async (id: number, stock: number) => {
    try {
      await api.put(`/admin/menus/${id}/stock`, { stock });
      fetchMenus();
    } catch (error) {
      console.error("Failed to update stock:", error);
    }
  };

  const handleEdit = (menu: Menu) => {
    setEditingMenu(menu);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingMenu(null);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingMenu(null);
    fetchMenus();
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Menu Management</h1>
          <p className="text-gray-500">Manage your coffee menu items</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-red-700 text-white rounded-xl font-medium hover:bg-red-800 transition-colors"
        >
          Add New Menu
        </button>
      </div>

      {/* Menu Form Modal */}
      {showForm && (
        <MenuForm
          menu={editingMenu}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}

      {/* Menu List */}
      <MenuList
        menus={menus}
        loading={loading}
        search={search}
        onSearchChange={setSearch}
        category={category}
        onCategoryChange={setCategory}
        categories={categories}
        onDelete={handleDelete}
        onToggleAvailability={handleToggleAvailability}
        onUpdateStock={handleUpdateStock}
        onEdit={handleEdit}
      />
    </div>
  );
};

export default MenuPage;