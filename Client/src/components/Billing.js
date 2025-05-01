import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Billing = () => {
  const {
    cartItems,
    clearCart,
    isLoggedIn,
    setShowLoginModal,
  } = useContext(AppContext);

  const navigate = useNavigate();
  const totalAmount = cartItems.reduce((sum, item) => sum + item.Price * item.quantity, 0);
  const backendUrl = 'http://localhost:5042/api/Order';

  const sendOrderToBackend = async (status) => {
    const token = localStorage.getItem('token');

    const order = {
      placedAt: new Date().toISOString(),
      total: totalAmount,
      status: status,
      items: cartItems.map(item => ({
        productId: item.Id,
        Name: item.Name,
        quantity: item.quantity,
        Price: item.Price
      })),
    };

    try {
      await axios.post(backendUrl, order, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      clearCart();
      navigate('/orders');
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    }
  };

  const handleApprovePayment = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    sendOrderToBackend('Approved');
  };

  const handleCancelOrder = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    sendOrderToBackend('Cancelled');
  };

  return (
    <div className="container mt-5">
      <h2>Billing Summary</h2>
      {cartItems.length === 0 ? (
        <p>No items in cart.</p>
      ) : (
        <div>
          <ul className="list-group mb-3">
            {cartItems.map((item) => (
              <li key={item.Id} className="list-group-item d-flex justify-content-between align-items-center">
                <span>{item.Name} (x{item.quantity})</span>
                <span>${item.Price * item.quantity}</span>
              </li>
            ))}
          </ul>

          <h4>Total Amount: ${totalAmount}</h4>
          <div className="mt-4">
            <button className="btn btn-success" onClick={handleApprovePayment}>
              Approve Payment
            </button>
            <button className="btn btn-danger ms-2" onClick={handleCancelOrder}>
              Cancel Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Billing;
