import { useState, useEffect, useCallback } from 'react';
import api from '../../services/api/config';
import { Menu, MenuFilters } from '../types/menu';

export const useMenus = () => {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [filters, setFilters] = useState<MenuFilters>({
    search: '',
    category: 'all',
  });

  const fetchMenus = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.category !== 'all') params.append('category', filters.category);
      if (filters.stock_status) params.append('stock_status', filters.stock_status);

      const response = await api.get(`/admin/menus?${params.toString()}`);
      setMenus(response.data.data.data || response.data.data);
    } catch (error) {
      console.error('Failed to fetch menus:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await api.get('/admin/categories');
      const categoryList = response.data.data.map((c: any) => c.category);
      setCategories(categoryList);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  }, []);

  useEffect(() => {
    fetchMenus();
  }, [fetchMenus]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const updateFilters = (newFilters: Partial<MenuFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const deleteMenu = async (id: number): Promise<boolean> => {
    try {
      await api.delete(`/admin/menus/${id}`);
      await fetchMenus();
      return true;
    } catch (error) {
      console.error('Failed to delete menu:', error);
      return false;
    }
  };

  const toggleAvailability = async (id: number): Promise<boolean> => {
    try {
      await api.patch(`/admin/menus/${id}/toggle-availability`);
      await fetchMenus();
      return true;
    } catch (error) {
      console.error('Failed to toggle availability:', error);
      return false;
    }
  };

  const updateStock = async (id: number, stock: number): Promise<boolean> => {
    try {
      await api.put(`/admin/menus/${id}/stock`, { stock });
      await fetchMenus();
      return true;
    } catch (error) {
      console.error('Failed to update stock:', error);
      return false;
    }
  };

  const createMenu = async (formData: FormData): Promise<boolean> => {
    try {
      await api.post('/admin/menus', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      await fetchMenus();
      return true;
    } catch (error) {
      console.error('Failed to create menu:', error);
      return false;
    }
  };

  const updateMenu = async (id: number, formData: FormData): Promise<boolean> => {
    try {
      await api.post(`/admin/menus/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      await fetchMenus();
      return true;
    } catch (error) {
      console.error('Failed to update menu:', error);
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