import React, { createContext, useState } from 'react';

// Creating the AppContext for global state
export const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartItems, setCartItems] = useState([]); // Cart items management
  const [showLoginModal, setShowLoginModal] = useState(false); // Modal visibility for login

  // Function to handle login
  const login = () => {
    setIsLoggedIn(true);
    setShowLoginModal(false); // Close modal on successful login
  };

  // Function to handle logout
  const logout = () => {
    setIsLoggedIn(false);
    setShowLoginModal(true); // Show modal on logout
  };

  // Function to add product to the cart
  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(item => item.Id === product.Id);
      if (existingItem) {
        return prevItems.map(item =>
          item.Id === product.Id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  // Function to remove product from the cart
  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter(item => item.Id !== productId));
  };

  // Function to update quantity of products in the cart
  const updateCartQuantity = (productId, operation) => {
    setCartItems((prevItems) =>
      prevItems
        .map(item =>
          item.Id === productId
            ? {
                ...item,
                quantity: operation === 'increase' ? item.quantity + 1 : item.quantity - 1
              }
            : item
        )
        .filter(item => item.quantity > 0)  // Remove items with quantity 0
    );
  };

  // Function to clear the cart
  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <AppContext.Provider value={{
      isLoggedIn,
      login,
      logout,
      cartItems,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      setShowLoginModal,
      showLoginModal,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
