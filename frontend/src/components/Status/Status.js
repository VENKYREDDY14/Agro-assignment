import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Status = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('jwtToken'); // Get the token from localStorage
        if (!token) {
          setError('User not authenticated. Please log in.');
          setLoading(false);
          return;
        }

        // Fetch orders
        const ordersResponse = await axios.get(`${backendUrl}/api/user/orders`, {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
          },
        });

        setOrders(ordersResponse.data);
        setLoading(false);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setError('No orders found for the authenticated user.');
        } else if (err.response && err.response.status === 401) {
          setError('Unauthorized access. Please log in again.');
        } else {
          setError('Failed to fetch orders. Please try again later.');
        }
        setLoading(false);
      }
    };

    fetchOrders();
  }, [backendUrl]);

  if (loading) {
    return <div className="p-4 pt-20 text-center">Loading...</div>;
  }

  if (error) {
    return (
      <div className="p-4 pt-20 text-center text-red-500">
        <h1 className="text-xl font-bold">Error</h1>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 pt-20">
      <h1 className="text-2xl font-bold mb-4">Order Status</h1>
      {orders.length > 0 ? (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Order ID</th>
              <th className="border border-gray-300 px-4 py-2">Items</th>
              <th className="border border-gray-300 px-4 py-2">Total Items</th>
              <th className="border border-gray-300 px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td className="border border-gray-300 px-4 py-2">{order._id}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <ul>
                    {order.items.map((item, index) => (
                      <li key={index}>
                        {item.name} - {item.quantity}
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="border border-gray-300 px-4 py-2">{order.items.length}</td>
                <td className="border border-gray-300 px-4 py-2">{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No orders found.</p>
      )}
    </div>
  );
};

export default Status;