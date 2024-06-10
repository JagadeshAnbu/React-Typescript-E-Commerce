import React, { createContext, useContext, useState, ReactNode } from "react";

// Define types for Cart Item and Context
export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  sizes?: string[]; // Make sizes property optional
}

interface User {
  username: string;
  location: string;
  avatarUrl: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: CartItem) => void;
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  removeFromCart: (id: number) => void;
  updateCartItemQuantity: (id: number, quantity: number) => void; // Add this line
}

// Create the context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Create the provider component
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [user, setUser] = useState<User | null>(null);


  const addToCart = (product: CartItem) => {
    setCartItems((prevItems) => {
      debugger;
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + product.quantity}
            : item
        );
      } else {
        return [...prevItems, { ...product, quantity:product.quantity, sizes: product.sizes }];
      }
    });
  };

  const updateCartItemQuantity = (id: number, quantity: number) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity: quantity } : item
      )
    );
  };


  const removeFromCart = (id: number) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  
  return (
    <CartContext.Provider value={{ cartItems, addToCart, user, setUser, removeFromCart, updateCartItemQuantity }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use the cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export { CartContext };
