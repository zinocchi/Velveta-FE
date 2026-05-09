// src/admin/pages/menus/MenuPage.tsx

import React, { useState } from "react";
import { useMenus } from "../../hooks/useMenus";
import MenuList from "./MenuList";
import MenuForm from "./MenuForm";
import { Menu } from "../../types/menu";

const MenuPage: React.FC = () => {
  const {
    menus,
    loading,
    isSearching,
    categories,
    filters,
    updateFilters,
    deleteMenu,
    toggleAvailability,
    updateStock,
    createMenu,
    updateMenu,
  } = useMenus();

  const [showForm, setShowForm] = useState(false);
  const [editingMenu, setEditingMenu] = useState<Menu | null>(null);

  // 🔥 Cek apakah categories masih loading (categories kosong dan loading true)
  const categoriesLoading = loading && categories.length === 0;

  // ... rest of code

  return (
    <div className="p-8">
      {/* Header tetap sama */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            Menu Management
          </h1>
          <p className="text-gray-500">Manage your coffee menu items</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-red-700 text-white rounded-xl font-medium hover:bg-red-800 transition-colors">
          Add New Menu
        </button>
      </div>

      {/* Menu Form Modal */}
      {showForm && (
        <MenuForm
          menu={editingMenu}
          categories={categories}
          onClose={() => {
            setShowForm(false);
            setEditingMenu(null);
          }}
          onSave={async (formData, isEdit, id) => {
            let success = false;
            if (isEdit && id) {
              success = await updateMenu(id, formData);
            } else {
              success = await createMenu(formData);
            }
            if (success) {
              setShowForm(false);
              setEditingMenu(null);
            }
          }}
        />
      )}

      {/* Menu List dengan skeleton loading */}
      <MenuList
        menus={menus}
        loading={loading}
        isSearching={isSearching}
        categoriesLoading={categoriesLoading}
        search={filters.search}
        onSearchChange={(value) => updateFilters({ search: value })}
        category={filters.category}
        onCategoryChange={(value) => updateFilters({ category: value })}
        categories={categories}
        onDelete={deleteMenu}
        onToggleAvailability={toggleAvailability}
        onUpdateStock={updateStock}
        onEdit={(menu) => {
          setEditingMenu(menu);
          setShowForm(true);
        }}
      />
    </div>
  );
};

export default MenuPage;
