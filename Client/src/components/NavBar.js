import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ setShowLoginModal }) => {
  const { logout, cartItems, isLoggedIn } = useContext(AppContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/'); // Redirect to login page after logout
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <div className="container-fluid">
        <span className="navbar-brand">🛍️ Product Sale App</span>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link to="/home" className="nav-link">Home</Link>
            </li>
            <li className="nav-item">
              <Link to="/catalog" className="nav-link">Catalog</Link>
            </li>
            <li className="nav-item">
              <Link to="/orders" className="nav-link">Orders</Link>
            </li>
            <li className="nav-item ms-3">
              <Link to="/cart" className="nav-link text-white">
                <i className="bi bi-cart-fill"></i> Cart ({cartItems.length})
              </Link>
            </li>
          </ul>
          {isLoggedIn ? (
            <button className="btn btn-outline-light ms-2" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <button className="btn btn-outline-light ms-2" onClick={() => setShowLoginModal(true)}>
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
