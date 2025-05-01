import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const {
    cartItems,
    removeFromCart,
    clearCart,
    updateCartQuantity,
    isLoggedIn,
    setShowLoginModal
  } = useContext(AppContext);

  const navigate = useNavigate();

  const handleQuantityChange = (productId, operation) => {
    updateCartQuantity(productId, operation);
  };

  const handleGoToBilling = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true); // Show modal if not logged in
      return;
    }
    navigate('/billing'); // Navigate to billing page
  };

  return (
    <div className="container mt-5">
      <h2>Your Cart</h2>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          <div className="row">
            <div className="col-8">
              <h5>Product</h5>
            </div>
            <div className="col-2">
              <h5>Price</h5>
            </div>
            <div className="col-2">
              <h5>Quantity</h5>
            </div>
          </div>

          <ul className="list-group">
            {cartItems.map((item) => (
              <li key={item.Id} className="list-group-item d-flex justify-content-between align-items-center">
                <div className="row w-100">
                  <div className="col-8 d-flex align-items-center">
                    <span>{item.Name}</span>
                  </div>

                  <div className="col-2">${item.Price}</div>

                  <div className="col-2 d-flex justify-content-between align-items-center">
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => handleQuantityChange(item.Id, 'decrease')}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => handleQuantityChange(item.Id, 'increase')}
                    >
                      +
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm ms-3"
                      onClick={() => removeFromCart(item.Id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-3">
            <h4>
              Total: $
              {cartItems.reduce((sum, item) => sum + item.Price * item.quantity, 0)}
            </h4>
            <button className="btn btn-success" onClick={handleGoToBilling}>
              Go to Billing
            </button>
            <button className="btn btn-danger ms-3" onClick={clearCart}>
              Clear Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
