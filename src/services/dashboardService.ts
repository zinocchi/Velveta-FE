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
      const ordersData = response.data.data || response.data;

      // Calculate completed orders total spent
      const completedOrders = ordersData.filter(
        (o: Order) => o.status === "COMPLETED"
      );
      const totalSpent = completedOrders.reduce(
        (sum: number, o: Order) => sum + o.total_price,
        0
      );

      // Calculate favorite drink
      const drinkCount: Record<string, { count: number; name: string }> = {};
      ordersData.forEach((order: Order) => {
        order.items.forEach((item) => {
          const drinkName = item.menu?.name || "Unknown";
          if (!drinkCount[drinkName]) {
            drinkCount[drinkName] = { count: 0, name: drinkName };
          }
          drinkCount[drinkName].count += item.qty;
        });
      });

      let favoriteDrink = "-";
      let favoriteCount = 0;
      Object.values(drinkCount).forEach((drink) => {
        if (drink.count > favoriteCount) {
          favoriteCount = drink.count;
          favoriteDrink = drink.name;
        }
      });

      // Get recent orders (last 5)
      const recentOrders = [...ordersData]
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
        .slice(0, 5);

      return {
        totalOrders: ordersData.length,
        totalSpent,
        favoriteDrink,
        favoriteCount,
        recentOrders,
        points: 0, // Coming soon
      };
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
      throw error;
    }
  }

  /**
   * Get single order details
   */
  async getOrderById(orderId: number): Promise<Order> {
    const response = await api.get<ApiResponse<Order>>(`/orders/${orderId}`);
    return response.data.data || response.data;
  }
}

export const dashboardService = new DashboardService();