import React, { useState } from 'react';
import { useMenus } from '../../hooks/useMenus';
import MenuList from './MenuList';
import MenuForm from './MenuForm';
import { Menu } from '../../types/menu';

const MenuPage: React.FC = () => {
  const {
    menus,
    loading,
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

  const handleEdit = (menu: Menu) => {
    setEditingMenu(menu);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingMenu(null);
  };

  const handleFormSave = async (formData: FormData, isEdit: boolean, id?: number) => {
    let success = false;
    if (isEdit && id) {
      success = await updateMenu(id, formData);
    } else {
      success = await createMenu(formData);
    }
    if (success) {
      handleFormClose();
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this menu?')) {
      await deleteMenu(id);
    }
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
          categories={categories}
          onClose={handleFormClose}
          onSave={handleFormSave}
        />
      )}

      {/* Menu List */}
      <MenuList
        menus={menus}
        loading={loading}
        search={filters.search}
        onSearchChange={(value) => updateFilters({ search: value })}
        category={filters.category}
        onCategoryChange={(value) => updateFilters({ category: value })}
        categories={categories}
        onDelete={handleDelete}
        onToggleAvailability={toggleAvailability}
        onUpdateStock={updateStock}
        onEdit={handleEdit}
      />
    </div>
  );
};

export default MenuPage;