import React, { createContext, useContext, useState, FC } from "react";


interface CartItem {
  id: number;
  name: string;
  image: string;
  price: number;
  quantity: number;
  variant: string;
  size: string;
}

interface CartContextProps {
  cartItems: CartItem[];
}

const CartContext = createContext<CartContextProps | undefined>(undefined);


export interface PricesProps {
  className?: string;
  price?: number;
  contentClass?: string;
}

const Prices: FC<PricesProps> = ({
  className = "",
  price = 33,
  contentClass = "py-1 px-2 md:py-1.5 md:px-2.5 text-sm font-medium",
}) => {
  return (
    <div className={`${className}`}>
      <div
        className={`flex items-center border-2 border-green-500 rounded-lg ${contentClass}`}
      >
        <span className="text-green-500 !leading-none">
          ${price}
        </span>
      </div>
    </div>
  );
};

export default Prices;
