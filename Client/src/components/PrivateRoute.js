import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const PrivateRoute = ({ children }) => {
  const { isLoggedIn, setShowLoginModal } = useContext(AppContext);

  if (!isLoggedIn) {
    setShowLoginModal(true);
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;
