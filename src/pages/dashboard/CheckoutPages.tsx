import { useCart } from "../../context/CartContext";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const CheckoutPage = () => {
  const { state, dispatch } = useCart();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [loading, setLoading] = useState(false);

  const total = state.items.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const handleCreateOrder = async () => {
    if (state.items.length === 0) return;

    try {
      setLoading(true);

      const res = await api.post("/orders", { 
        items: state.items.map((item) => ({ 
          id: item.id,
          qty: item.qty,
        })),
        payment_method: paymentMethod,
      });

      dispatch({ type: "CLEAR_CART" });

      navigate(`/checkout/pay/${res.data.order_id}`);
    } catch (err) {
      console.error(err);
      alert("Gagal checkout");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      {/* ITEMS */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        {state.items.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center border-b py-3"
          >
            <div>
              <p className="font-semibold">{item.name}</p>
              <p className="text-sm text-gray-500">
                {item.qty} × Rp {item.price.toLocaleString()}
              </p>
            </div>
            <p className="font-semibold">
              Rp {(item.qty * item.price).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* PAYMENT METHOD */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <h2 className="font-semibold mb-3">Payment Method</h2>

        {["cash", "debit", "gopay", "ovo", "dana"].map((method) => (
          <label
            key={method}
            className="flex items-center gap-2 mb-2 cursor-pointer"
          >
            <input
              type="radio"
              name="payment"
              value={method}
              checked={paymentMethod === method}
              onChange={() => setPaymentMethod(method)}
            />
            <span className="capitalize">{method}</span>
          </label>
        ))}
      </div>

      {/* TOTAL */}
      <div className="flex justify-between items-center mb-6">
        <span className="text-lg font-semibold">Total</span>
        <span className="text-lg font-bold">
          Rp {total.toLocaleString()}
        </span>
      </div>

      {/* BUTTON */}
      <button
        onClick={handleCreateOrder}
        disabled={loading}
        className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 disabled:opacity-50"
      >
        {loading ? "Processing..." : "Continue to Payment"}
      </button>
    </div>
  );
};

export default CheckoutPage;
