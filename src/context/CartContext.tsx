import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  type ReactNode,
} from "react";

/* ================= TYPES ================= */

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image_url: string | null;
  qty: number;
}

type CartState = {
  items: CartItem[];
};

type CartAction =
  | { type: "ADD_TO_CART"; payload: Omit<CartItem, "qty"> }
  | { type: "INCREMENT"; payload: number }
  | { type: "DECREMENT"; payload: number }
  | { type: "REMOVE"; payload: number }
  | { type: "CLEAR_CART" };

/* ================= REDUCER ================= */

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_TO_CART": {
      const existing = state.items.find(
        (item) => item.id === action.payload.id
      );

      if (existing) {
        return {
          items: state.items.map((item) =>
            item.id === action.payload.id
              ? { ...item, qty: item.qty + 1 }
              : item
          ),
        };
      }

      return {
        items: [...state.items, { ...action.payload, qty: 1 }],
      };
    }

    case "INCREMENT":
      return {
        items: state.items.map((item) =>
          item.id === action.payload
            ? { ...item, qty: item.qty + 1 }
            : item
        ),
      };

    case "DECREMENT":
      return {
        items: state.items
          .map((item) =>
            item.id === action.payload
              ? { ...item, qty: item.qty - 1 }
              : item
          )
          .filter((item) => item.qty > 0),
      };

    case "REMOVE":
      return {
        items: state.items.filter((item) => item.id !== action.payload),
      };

    case "CLEAR_CART":
      return { items: [] };

    default:
      return state;
  }
};

/* ================= CONTEXT ================= */

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  totalItems: number;
  totalPrice: number;
} | null>(null);

/* ================= INIT FROM STORAGE ================= */

const initCart = (): CartState => {
  const saved = localStorage.getItem("cart");
  return saved ? JSON.parse(saved) : { items: [] };
};

/* ================= PROVIDER ================= */

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, undefined, initCart);

  // 🔥 persist cart
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state));
  }, [state]);

  const totalItems = state.items.reduce((sum, item) => sum + item.qty, 0);

  const totalPrice = state.items.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  return (
    <CartContext.Provider value={{ state, dispatch, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

/* ================= HOOK ================= */

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return context;
};
