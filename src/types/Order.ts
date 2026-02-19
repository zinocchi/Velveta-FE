interface OrderItem {
  id: number;
  qty: number;
  price: number;
  menu: {
    name: string;
  };
}

export interface Order {
  id: number;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "CANCELLED";
  estimated_ready_at?: string | null;
  items: OrderItem[];
}
