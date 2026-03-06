import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../../api/axios";
import type { Order } from "../../types";
import OrderList from "./OrderList";
import OrderDetail from "./OrderDetail";

const OrdersPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedOrders, setSelectedOrders] = useState<number[]>([]);
  const [bulkStatus, setBulkStatus] = useState("");

  useEffect(() => {
    if (!id) {
      fetchOrders();
    }
  }, [filter, search, id]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filter !== "all") params.append("status", filter.toUpperCase());
      if (search) params.append("search", search);

      const response = await api.get(`/admin/orders?${params.toString()}`);
      setOrders(response.data.data.data || response.data.data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId: number, status: string) => {
    try {
      await api.put(`/admin/orders/${orderId}/status`, { status });
      if (id) {
        // If in detail page, refresh will happen via useEffect
      } else {
        fetchOrders();
      }
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  };

  const handleBulkUpdate = async () => {
    if (!bulkStatus || selectedOrders.length === 0) return;

    try {
      await api.post("/admin/orders/bulk-status", {
        order_ids: selectedOrders,
        status: bulkStatus,
      });
      setSelectedOrders([]);
      setBulkStatus("");
      fetchOrders();
    } catch (error) {
      console.error("Failed to bulk update orders:", error);
    }
  };

  // If there's an ID, show detail page
  if (id) {
    return <OrderDetail orderId={parseInt(id)} onStatusUpdate={handleUpdateStatus} />;
  }

  // Otherwise show list page
  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Order Management</h1>
          <p className="text-gray-500">Manage and track customer orders</p>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedOrders.length > 0 && (
        <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-amber-800">
              {selectedOrders.length} orders selected
            </span>
            <div className="flex items-center gap-3">
              <select
                value={bulkStatus}
                onChange={(e) => setBulkStatus(e.target.value)}
                className="px-3 py-1.5 border border-amber-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-200"
              >
                <option value="">Change status to...</option>
                <option value="PROCESSING">Processing</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
              <button
                onClick={handleBulkUpdate}
                disabled={!bulkStatus}
                className="px-4 py-1.5 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Apply
              </button>
              <button
                onClick={() => setSelectedOrders([])}
                className="px-4 py-1.5 bg-white border border-amber-200 text-amber-800 rounded-lg text-sm font-medium hover:bg-amber-100 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Orders List */}
      <OrderList
        orders={orders}
        loading={loading}
        filter={filter}
        onFilterChange={setFilter}
        search={search}
        onSearchChange={setSearch}
        selectedOrders={selectedOrders}
        onSelectOrder={(orderId, checked) => {
          if (checked) {
            setSelectedOrders([...selectedOrders, orderId]);
          } else {
            setSelectedOrders(selectedOrders.filter(id => id !== orderId));
          }
        }}
        onSelectAll={(checked) => {
          if (checked) {
            setSelectedOrders(orders.map(o => o.id));
          } else {
            setSelectedOrders([]);
          }
        }}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
};

export default OrdersPage;