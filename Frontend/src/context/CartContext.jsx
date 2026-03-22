import { createContext, useContext, useState } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Helper to safely get the ID whether your DB uses _id or id
  const getItemId = (item) => item?._id || item?.id;

  const addToCart = (menuItem, restaurant) => {
    const targetId = getItemId(menuItem);
    
    setCart((prev) => {
      const existing = prev.find((item) => getItemId(item) === targetId);
      if (existing) {
        return prev.map((item) =>
          getItemId(item) === targetId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { 
        ...menuItem, 
        _id: targetId, // Force standardizing to _id in the cart
        quantity: 1, 
        restaurantId: getItemId(restaurant), 
        restaurantName: restaurant.name 
      }];
    });
  };

  const removeFromCart = (menuItemId) => {
    setCart((prev) => {
      const existing = prev.find((item) => getItemId(item) === menuItemId);
      if (existing?.quantity === 1) {
        return prev.filter((item) => getItemId(item) !== menuItemId);
      }
      return prev.map((item) =>
        getItemId(item) === menuItemId ? { ...item, quantity: item.quantity - 1 } : item
      );
    });
  };

  const getItemQuantity = (menuItemId) => {
    const item = cart.find((i) => getItemId(i) === menuItemId);
    return item ? item.quantity : 0;
  };

  const clearCart = () => {
    setCart([]);
  };
  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, getItemQuantity,clearCart }}>
      {children}
    </CartContext.Provider>
  );


};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within <CartProvider>');
  return ctx;
};