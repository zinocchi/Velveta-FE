import { useEffect } from "react";
import api from "../../api/axios";

interface OrderItem {
  id: number;
  qty: number;
  price: number;
  menu: {
    name: string;
  };
}

interface Order {
  id: number;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "CANCELLED";
  estimated_ready_at?: string | null;
  items: OrderItem[];
}

interface Props {
  order: Order | null;
  setOrder: (order: Order | null) => void;
  onClose: () => void;
}

const OrderStatusModal = ({ order, setOrder, onClose }: Props) => {
  useEffect(() => {
    if (!order) return;

    const interval = setInterval(async () => {
      const res = await api.get(`/orders/${order.id}`);
      setOrder(res.data);
    }, 10000);

    return () => clearInterval(interval);
  }, [order?.id]);

  if (!order) return null;

  const statusMap = {
    PENDING: 1,
    PROCESSING: 2,
    COMPLETED: 3,
  } as const;

  const normalizedStatus = order.status?.toUpperCase().trim();

  const statusStep = statusMap[normalizedStatus as keyof typeof statusMap] ?? 0;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold">Order #{order.id}</h2>
          <button onClick={onClose}>✕</button>
        </div>

        <p className="mb-2">Status: {order.status}</p>

        <div className="flex gap-2 mb-4">
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className={`h-2 flex-1 rounded ${
                step <= statusStep ? "bg-amber-600" : "bg-gray-200"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderStatusModal;
