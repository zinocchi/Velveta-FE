import { useState, useEffect, useCallback } from "react";
import { menuService } from "../services/menuService";
import { Menu, MenuFilters, MenuState, GroupedCategories } from "../types/menu";

interface UseMenuReturn extends MenuState {
  groupedCategories: GroupedCategories;
  refetch: () => Promise<void>;
  regroup: () => void;
}

export const useMenu = (initialFilters?: MenuFilters): UseMenuReturn => {
  const [items, setItems] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<MenuFilters | undefined>(
    initialFilters,
  );

  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters?.category]); 

  const fetchMenu = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await menuService.getAll(filters);
      setItems(data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch menu");
      console.error("Error fetching menu:", err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchMenu();
  }, [fetchMenu]);

  const setGroupCategories = () => {
    return items.reduce((acc: GroupedCategories, menu) => {
      const category = menu.category?.trim() || "uncategorized";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(menu);
      return acc;
    }, {});
  };

  const groupedCategories = setGroupCategories();

  // console.log('useMenu - Items fetched:', items.length);
  // console.log('useMenu - Grouped categories:', (groupedCategories));

  return {
    items,
    groupedCategories,
    loading,
    error,
    refetch: fetchMenu,
    regroup: setGroupCategories,
  };
};

export const useCategoryMenu = (category: string) => {
  return useMenu({ category });
};