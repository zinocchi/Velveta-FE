  import { useState, useEffect, useCallback } from "react";
  import api from "../../services/api/config";
  import { Menu, MenuFilters } from "../types/menu";

  export const useMenus = () => {
    const [menus, setMenus] = useState<Menu[]>([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState<string[]>([]);
    const [filters, setFilters] = useState<MenuFilters>({
      search: "",
      category: "all",
    });

    const fetchMenus = useCallback(async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (filters.search) params.append("search", filters.search);
        if (filters.category !== "all")
          params.append("category", filters.category);
        if (filters.stock_status)
          params.append("stock_status", filters.stock_status);

        const response = await api.get(`/admin/menus?${params.toString()}`);
        const menuData = response.data.data.data || response.data.data;
        setMenus(Array.isArray(menuData) ? menuData : []);
      } catch (error) {
        console.error("Failed to fetch menus:", error);
        setMenus([]);
      } finally {
        setLoading(false);
      }
    }, [filters]);

    const fetchCategories = useCallback(async () => {
      try {
        const response = await api.get("/admin/categories");
        const categoryList = response.data.data.map((c: any) => c.category);
        setCategories(categoryList);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        setCategories([]);
      }
    }, []);

    useEffect(() => {
      fetchMenus();
    }, [fetchMenus]);

    useEffect(() => {
      fetchCategories();
    }, [fetchCategories]);

    const updateFilters = (newFilters: Partial<MenuFilters>) => {
      setFilters((prev) => ({ ...prev, ...newFilters }));
    };

    const deleteMenu = async (id: number): Promise<boolean> => {
      try {
        await api.delete(`/admin/menus/${id}`);
        await fetchMenus();
        return true;
      } catch (error) {
        console.error("Failed to delete menu:", error);
        return false;
      }
    };

    const toggleAvailability = async (id: number): Promise<boolean> => {
      try {
        await api.patch(`/admin/menus/${id}/toggle-availability`);
        await fetchMenus();
        return true;
      } catch (error) {
        console.error("Failed to toggle availability:", error);
        return false;
      }
    };

    const updateStock = async (id: number, stock: number): Promise<boolean> => {
      try {
        await api.put(`/admin/menus/${id}/stock`, { stock });
        await fetchMenus();
        return true;
      } catch (error) {
        console.error("Failed to update stock:", error);
        return false;
      }
    };

    const createMenu = async (formData: FormData): Promise<boolean> => {
      try {
        if (formData.has("_method")) {
          formData.delete("_method");
        }

        console.log("Creating menu...");
        const response = await api.put("/admin/menus", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        console.log("Create menu response:", response.data);
        await fetchMenus();
        return true;
      } catch (error: any) {
        console.error("Failed to create menu:", error);

        if (error.response?.data?.errors) {
          const errorMessages = Object.values(error.response.data.errors).flat();
          alert(`Validation Error:\n${errorMessages.join("\n")}`);
        } else if (error.response?.data?.message) {
          alert(`Error: ${error.response.data.message}`);
        } else {
          alert("Failed to create menu. Please check your input.");
        }

        return false;
      }
    };

    const updateMenu = async (
      id: number,
      formData: FormData,
    ): Promise<boolean> => {
      try {
        if (formData.has("_method")) {
          formData.delete("_method");
        }
        formData.append("_method", "PUT");

        console.log(`Updating menu ${id}...`);
        const response = await api.post(`/admin/menus/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        console.log("Update menu response:", response.data);
        await fetchMenus();
        return true;
      } catch (error: any) {
        console.error("Failed to update menu:", error);

        // Tampilkan error detail
        if (error.response?.data?.errors) {
          const errorMessages = Object.values(error.response.data.errors).flat();
          alert(`Validation Error:\n${errorMessages.join("\n")}`);
        } else if (error.response?.data?.message) {
          alert(`Error: ${error.response.data.message}`);
        } else {
          alert("Failed to update menu. Please check your input.");
        }

        return false;
      }
    };

    return {
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
      refresh: fetchMenus,
    };
  };
