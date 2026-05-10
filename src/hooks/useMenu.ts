import { useState, useEffect, useCallback, useRef } from "react";
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
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchMenu = useCallback(
    async (filters?: MenuFilters) => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      setLoading(true);
      setError(null);

      try {
        const data = await menuService.getAll(filters || initialFilters);

        const filteredData =
          filters?.category && filters.category !== "all"
            ? data.filter((item) => item.category === filters.category)
            : data;

        setItems(filteredData);
      } catch (err: any) {
        if (err?.name === "AbortError" || err?.code === "ERR_CANCELED") return;
        setError(err.response?.data?.message || "Failed to fetch menu");
        console.error("Error fetching menu:", err);
      } finally {
        setLoading(false);
      }
    },
    [initialFilters],
  );

  useEffect(() => {
    fetchMenu(initialFilters);

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [initialFilters?.category, initialFilters?.search]); // Langsung cek perubahan filter

  const setGroupCategories = useCallback(() => {
    return items.reduce((acc: GroupedCategories, menu) => {
      const category = menu.category?.trim() || "uncategorized";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(menu);
      return acc;
    }, {});
  }, [items]);

  const groupedCategories = setGroupCategories();

  console.log("useMenu - Items fetched:", items.length);
  console.log("useMenu - Grouped categories:", groupedCategories);

  return {
    items,
    groupedCategories,
    loading,
    error,
    refetch: () => fetchMenu(initialFilters),
    regroup: setGroupCategories,
  };
};

export const useCategoryMenu = (category: string) => {
  return useMenu({ category });
};
