import React, { useEffect, useRef } from "react";
import { useCart } from "../../context/CartContext";
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

      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollbarWidth}px`;

      document.addEventListener("click", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "0px";

      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
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

  const handleBrowseMenu = () => {
    onClose();
    navigate("/menu");
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop with blur effect */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          ref={modalRef}
          className="bg-white rounded-2xl w-full max-w-md shadow-2xl max-h-[90vh] flex flex-col pointer-events-auto animate-fadeIn"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-10 rounded-t-2xl">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Shopping Cart</h2>
              <p className="text-sm text-gray-500">{totalItems} items</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-xl p-1 hover:bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Cart Items - Scrollable area */}
          <div className="flex-1 overflow-y-auto p-4">
            {state.items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-5xl">🛒</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Your cart is empty
                </h3>
                <p className="text-sm text-gray-500 text-center mb-6">
                  Looks like you haven't added any items to your cart yet.
                </p>
                <button
                  onClick={handleBrowseMenu}
                  className="px-6 py-3 bg-red-700 text-white rounded-xl font-medium hover:bg-red-800 transition-colors flex items-center gap-2"
                >
                  <span>Browse Menu</span>
                  <span>→</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {state.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between bg-gray-50 p-4 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-2xl">📦</span>
                        </div>
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
                          className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
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
                          className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() =>
                          dispatch({ type: "REMOVE", payload: item.id })
                        }
                        className="text-red-500 hover:text-red-700 ml-2 text-sm font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {state.items.length > 0 && (
            <div className="border-t p-6 bg-white sticky bottom-0 rounded-b-2xl">
              <div className="flex justify-between items-center mb-6">
                <span className="text-gray-600">Total</span>
                <span className="text-2xl font-bold text-gray-800">
                  {formatCurrency(totalPrice)}
                </span>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => dispatch({ type: "CLEAR_CART" })}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  disabled={state.items.length === 0}
                >
                  Clear All
                </button>
                <button
                  onClick={handleCheckout}
                  className="flex-1 py-3 bg-red-700 text-white rounded-xl hover:bg-red-800 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  disabled={state.items.length === 0}
                > 
                  Checkout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Animation styles */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </>
  );
};

export default CartModal;