import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import LoginModal from './LoginModal';
const Login = () => {
  const { setShowLoginModal } = useContext(AppContext);

  return (
    <div className="container py-4">
      <h2>Welcome to the Product Sale App</h2>
      <LoginModal/>
      <button className="btn btn-primary" onClick={() => setShowLoginModal(true)}>
        Login
      </button>
    </div>
  );
};

export default Login;
