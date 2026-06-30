import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as settingsService from '../services/settingsService';
import { useAuth } from './AuthContext';

const CafeContext = createContext();

export const useCafe = () => useContext(CafeContext);

export const CafeProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState([]); // [{ menuItem, name, price, quantity, image }]
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('cafeflow_theme') === 'dark');
  const [settings, setSettings] = useState({ cafeName: 'CafeFlow', gstPercent: 5 });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('cafeflow_theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    if (isAuthenticated) {
      settingsService
        .getSettings()
        .then((res) => setSettings(res.data.data))
        .catch(() => {});
    }
  }, [isAuthenticated]);

  const addToCart = useCallback((item) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.menuItem === item._id);
      if (existing) {
        return prev.map((c) => (c.menuItem === item._id ? { ...c, quantity: c.quantity + 1 } : c));
      }
      return [
        ...prev,
        { menuItem: item._id, name: item.name, price: item.price, image: item.image, quantity: 1 },
      ];
    });
  }, []);

  const increaseQty = (menuItemId) => {
    setCart((prev) => prev.map((c) => (c.menuItem === menuItemId ? { ...c, quantity: c.quantity + 1 } : c)));
  };

  const decreaseQty = (menuItemId) => {
    setCart((prev) =>
      prev
        .map((c) => (c.menuItem === menuItemId ? { ...c, quantity: c.quantity - 1 } : c))
        .filter((c) => c.quantity > 0)
    );
  };

  const removeFromCart = (menuItemId) => {
    setCart((prev) => prev.filter((c) => c.menuItem !== menuItemId));
  };

  const clearCart = () => {
    setCart([]);
    setSelectedCustomer(null);
  };

  const cartSubtotal = cart.reduce((sum, c) => sum + c.price * c.quantity, 0);

  return (
    <CafeContext.Provider
      value={{
        cart,
        addToCart,
        increaseQty,
        decreaseQty,
        removeFromCart,
        clearCart,
        cartSubtotal,
        selectedCustomer,
        setSelectedCustomer,
        darkMode,
        setDarkMode,
        settings,
        setSettings,
      }}
    >
      {children}
    </CafeContext.Provider>
  );
};
