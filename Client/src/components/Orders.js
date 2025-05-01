import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';

const Orders = () => {
  const { isLoggedIn, setShowLoginModal } = useContext(AppContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }

    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5042/api/Order', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setOrders(response.data?.$values || []);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
        alert('Error loading your orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isLoggedIn, setShowLoginModal]);

  if (!isLoggedIn) return <p className="container mt-4">Please log in to view your orders.</p>;
  if (loading) return <p className="container mt-4">Loading orders...</p>;

  return (
    <div className="container py-4">
      <h2 className="mb-4">Your Orders</h2>
      {orders.length === 0 ? (
        <p>You have no past orders.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered align-middle text-center">
            <thead className="table-dark">
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Total ($)</th>
                <th>Items</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.Id}>
                  <td>{order.Id}</td>
                  <td>{new Date(order.PlacedAt).toLocaleString()}</td>
                  <td>{order.Total}</td>
                  <td>
                    {order.Items?.$values.map((item, index) => (
                      <div key={index} className="mb-1">
                        <span className="badge bg-secondary">
                          {item.Product?.Name} x {item.Quantity}
                        </span>
                      </div>
                    ))}
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        order.Status === 'Approved'
                          ? 'bg-success'
                          : order.Status === 'Cancelled'
                          ? 'bg-danger'
                          : 'bg-warning text-dark'
                      }`}
                    >
                      {order.Status || 'Pending'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Orders;
