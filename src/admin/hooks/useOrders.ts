
import { useState, useEffect, useCallback } from 'react';
import { useDebounce } from '../hooks/useDebounce';
import api from '../../services/api/config';
import { Order, OrderFilters } from '../types/order';

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<OrderFilters>({
    status: 'all',
    search: '',
  });
  const [selectedOrders, setSelectedOrders] = useState<number[]>([]);

  // 🔥 Debounce search value
  const debouncedSearch = useDebounce(filters.search, 500);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.status !== 'all') params.append('status', filters.status.toUpperCase());
      // 🔥 Gunakan debouncedSearch
      if (debouncedSearch) params.append('search', debouncedSearch);

      const response = await api.get(`/admin/orders?${params.toString()}`);
      setOrders(response.data.data.data || response.data.data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  }, [filters.status, debouncedSearch]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const updateFilters = (newFilters: Partial<OrderFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const updateOrderStatus = async (orderId: number, status: string): Promise<boolean> => {
    try {
      await api.put(`/admin/orders/${orderId}/status`, { status });
      await fetchOrders();
      return true;
    } catch (error) {
      console.error('Failed to update order status:', error);
      return false;
    }
  };

  const bulkUpdateStatus = async (orderIds: number[], status: string): Promise<boolean> => {
    try {
      await api.post('/admin/orders/bulk-status', {
        order_ids: orderIds,
        status,
      });
      await fetchOrders();
      setSelectedOrders([]);
      return true;
    } catch (error) {
      console.error('Failed to bulk update status:', error);
      return false;
    }
  };

  const getOrderById = async (id: number): Promise<Order | null> => {
    try {
      const response = await api.get(`/admin/orders/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch order:', error);
      return null;
    }
  };

  return {
    orders,
    loading,
    filters,
    selectedOrders,
    setSelectedOrders,
    updateFilters,
    updateOrderStatus,
    bulkUpdateStatus,
    getOrderById,
    refresh: fetchOrders,
  };
};