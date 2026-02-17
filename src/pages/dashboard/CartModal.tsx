// CartModal.tsx
import React, { useEffect, useRef } from "react";
import { useCart } from "../../context/CartContext";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose }) => {
  const { totalPrice, totalItems } = useCart();
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    if (isOpen) {
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;

      document.addEventListener("click", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "0px";
    };
  }, [isOpen, onClose]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const { state, dispatch } = useCart();
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (state.items.length === 0) return;

    onClose();
    navigate("/dashboard/checkout");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black overflow-y-auto bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        ref={modalRef}
        className="bg-white rounded-2xl w-full max-w-md shadow-xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Shopping Cart</h2>
            <p className="text-sm text-gray-500">{totalItems} items</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl p-1"
          >
            ✕
          </button>
        </div>

        {/* Cart Items - Scrollable area */}
        <div className="flex-1 overflow-y-auto p-4">
          {state.items.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 text-5xl mb-4">🛒</div>
              <p className="text-gray-500">Your cart is empty</p>
              <p className="text-sm text-gray-400 mt-1">
                Add items from the menu
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {state.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between bg-gray-50 p-4 rounded-xl"
                >
                  <div className="flex items-center space-x-4">
                    {item.image_url && (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    )}
                    <div>
                      <h3 className="font-medium text-gray-800">{item.name}</h3>
                      <p className="text-gray-600">
                        {formatCurrency(item.price)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() =>
                          dispatch({ type: "DECREMENT", payload: item.id })
                        }
                        className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300"
                      >
                        −
                      </button>
                      <span className="font-medium w-6 text-center">
                        {item.qty}
                      </span>
                      <button
                        onClick={() =>
                          dispatch({ type: "INCREMENT", payload: item.id })
                        }
                        className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() =>
                        dispatch({ type: "REMOVE", payload: item.id })
                      }
                      className="text-red-500 hover:text-red-700 ml-2"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer - Sticky bottom */}
        <div className="border-t p-6 bg-white sticky bottom-0">
          <div className="flex justify-between items-center mb-6">
            <span className="text-gray-600">Total</span>
            <span className="text-2xl font-bold text-gray-800">
              {formatCurrency(totalPrice)}
            </span>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => dispatch({ type: "CLEAR_CART" })}
              className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={state.items.length === 0}
            >
              Clear All
            </button>
            <button
              onClick={handleCheckout}
              className="flex-1 py-3 bg-red-700 text-white rounded-xl hover:bg-amber-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={state.items.length === 0}
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartModal;
