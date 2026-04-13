import React, {createContext, useContext, useState} from 'react';

const CartContext = createContext(null);

export const CartProvider = ({children}) => {
  const [cartItems, setCartItems] = useState([]);

  // Ajouter ou incrementer la quantite
  const addToCart = (offer, mode = 'credit') => {
    setCartItems(prev => {
      const existing = prev.find(i => i.offer.id === offer.id && i.mode === mode);
      if (existing) {
        return prev.map(i =>
          i.offer.id === offer.id && i.mode === mode
            ? {...i, qty: i.qty + 1}
            : i,
        );
      }
      return [...prev, {offer, mode, qty: 1}];
    });
  };

  // Decrementer ou retirer
  const removeFromCart = (offerId, mode) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.offer.id === offerId && i.mode === mode);
      if (!existing) return prev;
      if (existing.qty <= 1) {
        return prev.filter(i => !(i.offer.id === offerId && i.mode === mode));
      }
      return prev.map(i =>
        i.offer.id === offerId && i.mode === mode ? {...i, qty: i.qty - 1} : i,
      );
    });
  };

  const clearCart = () => setCartItems([]);

  const totalItems = cartItems.reduce((sum, i) => sum + i.qty, 0);
  const totalAmount = cartItems.reduce((sum, i) => {
    const price = i.mode === 'credit' ? i.offer.priceCredit : i.offer.priceCash;
    return sum + price * i.qty;
  }, 0);

  return (
    <CartContext.Provider
      value={{cartItems, addToCart, removeFromCart, clearCart, totalItems, totalAmount}}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart doit etre utilise dans CartProvider');
  return ctx;
};

export default CartContext;
