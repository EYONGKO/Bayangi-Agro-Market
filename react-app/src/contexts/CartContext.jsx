import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [currentCommunity, setCurrentCommunity] = useState('index');

  useEffect(() => {
    const community = document.body.dataset.community || 'index';
    setCurrentCommunity(community);
  }, []);

  useEffect(() => {
    const localStorageKey = `cart-${currentCommunity}`;
    const storedCart = localStorage.getItem(localStorageKey);
    if (storedCart) {
      try {
        setCart(JSON.parse(storedCart));
      } catch {
        setCart([]);
      }
    } else {
      setCart([]);
    }
  }, [currentCommunity]);

  useEffect(() => {
    const localStorageKey = `cart-${currentCommunity}`;
    localStorage.setItem(localStorageKey, JSON.stringify(cart));
  }, [cart, currentCommunity]);

  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(
        item => item.id === product.id && item.community === currentCommunity
      );

      if (existingItemIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingItemIndex].quantity += 1;
        return newCart;
      }

      return [...prevCart, { ...product, community: currentCommunity, quantity: 1 }];
    });
  };

  const removeFromCart = (productName) => {
    setCart(prevCart => prevCart.filter(item => item.name !== productName));
  };

  const updateQuantity = (productName, quantity) => {
    setCart(prevCart => {
      const next = prevCart
        .map(item =>
          item.name === productName
            ? { ...item, quantity: parseInt(quantity) }
            : item
        )
        .filter(item => item.quantity > 0);

      return next;
    });
  };

  const getCartCount = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, getCartCount }}>
      {children}
    </CartContext.Provider>
  );
};
