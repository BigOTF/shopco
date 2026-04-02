"use client";
import { createContext, useContext, useReducer, ReactNode, useEffect } from "react";

export type FilterState = {
  category: string; 
  priceRange: [number, number];     
  minRating: number;           
  minDiscount: number;            
  availability: "all" | "in-stock" | "out-of-stock";
  brands: string[];                
  sortBy: "default" | "price-low" | "price-high" | "rating" | "discount";
  reviewSort: "latest" | "oldest" | "highest" | "lowest";
};

export type CartItem = {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  quantity: number;
  discountPercentage: number
};

type AppState = {
  filter: FilterState;
  cart: CartItem[];
};

type FilterAction =
  | { type: "SET_CATEGORY"; payload: string }
  | { type: "SET_PRICE_RANGE"; payload: [number, number] }
  | { type: "SET_MIN_RATING"; payload: number }
  | { type: "SET_MIN_DISCOUNT"; payload: number }
  | { type: "TOGGLE_BRAND"; payload: string }
  | { type: "SET_AVAILABILITY"; payload: "all" | "in-stock" | "out-of-stock" }
  | { type: "SET_SORT"; payload: FilterState["sortBy"] }
  | { type: "RESET_FILTERS" }
  | { type: "SET_REVIEW_SORT"; payload: FilterState["reviewSort"] }

type CartAction =
  | { type: "ADD_TO_CART"; payload: CartItem }
  | { type: "REMOVE_FROM_CART"; payload: number }
  | { type: "INCREMENT_QUANTITY"; payload: number }
  | { type: "DECREMENT_QUANTITY"; payload: number }
  | { type: "CLEAR_CART" };

type Action = FilterAction | CartAction;

const initialFilterState: FilterState = {
  category: "",          
  priceRange: [0, 500], 
  minRating: 0,
  minDiscount: 0,
  availability: "all",
  brands: [],
  sortBy: "default",
  reviewSort: "latest",
};

const initialState: AppState = {
  filter: initialFilterState,
  cart: typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem("cart") ?? "[]")
    : [],
};

const appReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    //FILTER
    case "SET_CATEGORY":
      return { ...state, filter: { ...state.filter, category: action.payload, brands: [] }};
    case "SET_PRICE_RANGE":
      return { ...state, filter: { ...state.filter, priceRange: action.payload }};
    case "SET_MIN_RATING":
      return { ...state, filter: { ...state.filter, minRating: action.payload }};
    case "SET_MIN_DISCOUNT":
      return { ...state, filter: { ...state.filter, minDiscount: action.payload }};
    case "TOGGLE_BRAND": {
      const hasBrand = state.filter.brands.includes(action.payload);
      return { ...state, filter: { ...state.filter, brands: hasBrand ? state.filter.brands.filter((b) => b !== action.payload) : [...state.filter.brands, action.payload] }};
    }
    case "SET_AVAILABILITY":
      return { ...state, filter: { ...state.filter, availability: action.payload }};
    case "SET_SORT":
      return { ...state, filter: { ...state.filter, sortBy: action.payload }};
    case "RESET_FILTERS":
      return { ...state, filter: initialFilterState };
    case "SET_REVIEW_SORT":
      return { ...state, filter: { ...state.filter, reviewSort: action.payload }};

    //CART
    case "ADD_TO_CART": {
      const exists = state.cart.find((item) => item.id === action.payload.id);
      if (exists) {
        return {
          ...state,
          cart: state.cart.map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          ),
        };
      }
      return { ...state, cart: [...state.cart, action.payload] };
    }

    case "REMOVE_FROM_CART":
      return { ...state, cart: state.cart.filter((item) => item.id !== action.payload) };

    case "INCREMENT_QUANTITY":
      return {
        ...state,
        cart: state.cart.map((item) =>
          item.id === action.payload ? { ...item, quantity: item.quantity + 1 } : item
        ),
      };

    case "DECREMENT_QUANTITY":
      return {
        ...state,
        cart: state.cart.map((item) =>
          item.id === action.payload
            ? { ...item, quantity: Math.max(1, item.quantity - 1) }
            : item
        ),
      };

    case "CLEAR_CART":
      return { ...state, cart: [] };

    default:
      return state;
  }
};

type ContextType = {
  state: AppState;
  dispatch: React.Dispatch<Action>;
};

const AppContext = createContext<ContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state.cart));
  }, [state.cart]);
  
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};
