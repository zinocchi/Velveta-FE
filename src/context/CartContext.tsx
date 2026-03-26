import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  type ReactNode,
} from "react";
import { useAuthContext } from "./AuthContext";

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image_url: string | null;
  qty: number;
}

type CartState = {
  items: CartItem[];
  userId: string | null; // Track which user owns this cart
};

type CartAction =
  | { type: "ADD_TO_CART"; payload: Omit<CartItem, "qty"> }
  | { type: "INCREMENT"; payload: number }
  | { type: "DECREMENT"; payload: number }
  | { type: "REMOVE"; payload: number }
  | { type: "CLEAR_CART" }
  | { type: "SET_CART"; payload: CartItem[] }
  | { type: "RESET_CART" };

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_TO_CART": {
      const existing = state.items.find(
        (item) => item.id === action.payload.id,
      );

      if (existing) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === action.payload.id
              ? { ...item, qty: item.qty + 1 }
              : item,
          ),
        };
      }

      return {
        ...state,
        items: [...state.items, { ...action.payload, qty: 1 }],
      };
    }

    case "INCREMENT":
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload ? { ...item, qty: item.qty + 1 } : item,
        ),
      };

    case "DECREMENT":
      return {
        ...state,
        items: state.items
          .map((item) =>
            item.id === action.payload ? { ...item, qty: item.qty - 1 } : item,
          )
          .filter((item) => item.qty > 0),
      };

    case "REMOVE":
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };

    case "CLEAR_CART":
      return { ...state, items: [] };

    case "SET_CART":
      return { ...state, items: action.payload };

    case "RESET_CART":
      return { items: [], userId: null };

    default:
      return state;
  }
};

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  totalItems: number;
  totalPrice: number;
  loadCartFromStorage: (userId: string) => void;
  saveCartToStorage: () => void;
} | null>(null);

const CART_STORAGE_KEY = "cart";

const getStorageKey = (userId?: string) => {
  return userId ? `${CART_STORAGE_KEY}_${userId}` : `${CART_STORAGE_KEY}_guest`;
};

const initCart = (): CartState => {
  // Try to get guest cart first
  const guestCart = localStorage.getItem(getStorageKey());
  if (guestCart) {
    return JSON.parse(guestCart);
  }
  return { items: [], userId: null };
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user, isLoggedIn } = useAuthContext();
  const [state, dispatch] = useReducer(cartReducer, undefined, initCart);

  // Load cart when user logs in or user changes
  useEffect(() => {
    if (isLoggedIn && user?.id) {
      // Load user's cart from localStorage
      const userCartKey = getStorageKey(user.id.toString());
      const savedUserCart = localStorage.getItem(userCartKey);
      
      if (savedUserCart) {
        const parsedCart = JSON.parse(savedUserCart);
        dispatch({ type: "SET_CART", payload: parsedCart.items });
      } else {
        // Check if there's a guest cart to merge
        const guestCartKey = getStorageKey();
        const guestCart = localStorage.getItem(guestCartKey);
        
        if (guestCart && JSON.parse(guestCart).items.length > 0) {
          // Merge guest cart with user cart
          const parsedGuestCart = JSON.parse(guestCart);
          dispatch({ type: "SET_CART", payload: parsedGuestCart.items });
          // Clear guest cart after merge
          localStorage.removeItem(guestCartKey);
        } else {
          // Start with empty cart for new user
          dispatch({ type: "CLEAR_CART" });
        }
      }
    } else if (!isLoggedIn) {
      // Load guest cart when logged out
      const guestCartKey = getStorageKey();
      const guestCart = localStorage.getItem(guestCartKey);
      
      if (guestCart) {
        const parsedCart = JSON.parse(guestCart);
        dispatch({ type: "SET_CART", payload: parsedCart.items });
      } else {
        dispatch({ type: "CLEAR_CART" });
      }
    }
  }, [user?.id, isLoggedIn]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    const saveCart = () => {
      const storageKey = isLoggedIn && user?.id 
        ? getStorageKey(user.id.toString())
        : getStorageKey();
      
      localStorage.setItem(storageKey, JSON.stringify({ items: state.items, userId: user?.id || null }));
    };
    
    saveCart();
  }, [state.items, isLoggedIn, user?.id]);

  const totalItems = state.items.reduce((sum, item) => sum + item.qty, 0);

  const totalPrice = state.items.reduce(
    (sum, item) => sum + item.price * item.qty,
    0,
  );

  const loadCartFromStorage = (userId: string) => {
    const storageKey = getStorageKey(userId);
    const savedCart = localStorage.getItem(storageKey);
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      dispatch({ type: "SET_CART", payload: parsedCart.items });
    }
  };

  const saveCartToStorage = () => {
    const storageKey = isLoggedIn && user?.id 
      ? getStorageKey(user.id.toString())
      : getStorageKey();
    localStorage.setItem(storageKey, JSON.stringify({ items: state.items, userId: user?.id || null }));
  };

  return (
    <CartContext.Provider 
      value={{ 
        state, 
        dispatch, 
        totalItems, 
        totalPrice,
        loadCartFromStorage,
        saveCartToStorage
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return context;
};