import api from "../services/api/config";
import { Order, DashboardStats } from "../types/dashboard";
import { ApiResponse } from "../types/api";

class DashboardService {
  /**
   * Get user's orders and calculate dashboard stats
   */
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const response = await api.get<ApiResponse<Order[]>>("/orders/my");

      console.log("Dashboard API Response:", response);

      if (!response.data) {
        console.error("No data in response");
        return this.getEmptyStats();
      }

      let ordersData: Order[] = [];

      if (response.data.data && Array.isArray(response.data.data)) {
        ordersData = response.data.data;
      } else if (Array.isArray(response.data)) {
        ordersData = response.data;
      } else {
        console.error("Unexpected response structure:", response.data);
        return this.getEmptyStats();
      }

      if (ordersData.length === 0) {
        return this.getEmptyStats();
      }

      const completedOrders = ordersData.filter(
        (o: Order) => o.status === "COMPLETED",
      );

      const totalSpent = completedOrders.reduce(
        (sum: number, o: Order) => sum + Number(o.total_price || 0),
        0,
      );
      console.log("Total Spent:", totalSpent);

      const drinkCount: Record<string, { count: number; name: string }> = {};

      ordersData.forEach((order: Order) => {
        if (order.items && Array.isArray(order.items)) {
          order.items.forEach((item) => {
            if (item && item.qty) {
              const drinkName = item.menu?.name || item.menu_name || "Unknown";
              if (!drinkCount[drinkName]) {
                drinkCount[drinkName] = { count: 0, name: drinkName };
              }
              drinkCount[drinkName].count += item.qty;
            }
          });
        }
      });

      let favoriteDrink = "-";
      let favoriteCount = 0;
      Object.values(drinkCount).forEach((drink) => {
        if (drink.count > favoriteCount) {
          favoriteCount = drink.count;
          favoriteDrink = drink.name;
        }
      });

      const recentOrders = [...ordersData]
        .filter((order) => order.created_at)
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        )
        .slice(0, 5);

      return {
        totalOrders: ordersData.length,
        totalSpent,
        favoriteDrink,
        favoriteCount,
        recentOrders,
        points: 0,
      };
    } catch (error: any) {
      console.error("Failed to fetch dashboard stats:", error);

      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        console.error("Error response headers:", error.response.headers);
      } else if (error.request) {
        console.error("Error request:", error.request);
      } else {
        console.error("Error message:", error.message);
      }

      return this.getEmptyStats();
    }
  }

  /**
   * Get empty dashboard stats
   */
  private getEmptyStats(): DashboardStats {
    return {
      totalOrders: 0,
      totalSpent: 0,
      favoriteDrink: "-",
      favoriteCount: 0,
      recentOrders: [],
      points: 0,
    };
  }

  /**
   * Get single order details
   */
  async getOrderById(orderId: number): Promise<Order> {
    try {
      const response = await api.get<ApiResponse<Order>>(`/orders/${orderId}`);
      return response.data.data || response.data;
    } catch (error: any) {
      console.error(`Failed to fetch order ${orderId}:`, error);
      throw error;
    }
  }
}

export const dashboardService = new DashboardService();
