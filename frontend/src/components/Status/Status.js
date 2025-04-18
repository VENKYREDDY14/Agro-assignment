import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify'; // Import toast for notifications
import { ThreeDots } from 'react-loader-spinner'; // Import the specific loader

const Status = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  // Function to render the loading spinner
  const renderLoadingView = () => (
    <div className="flex justify-center items-center min-h-screen" data-testid="loader">
      <ThreeDots color="#0b69ff" height={50} width={50} />
    </div>
  );

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('jwtToken'); // Get the token from localStorage
        if (!token) {
          setError('User not authenticated. Please log in.');
          setLoading(false);
          toast.error('User not authenticated. Please log in.');
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
        toast.success('Orders fetched successfully!');
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setError('No orders found for the authenticated user.');
          toast.error('No orders found.');
        } else if (err.response && err.response.status === 401) {
          setError('Unauthorized access. Please log in again.');
          toast.error('Unauthorized access. Please log in again.');
        } else {
          setError('Failed to fetch orders. Please try again later.');
          toast.error('Failed to fetch orders. Please try again later.');
        }
        setLoading(false);
      }
    };

    fetchOrders();
  }, [backendUrl]);

  if (loading) {
    return renderLoadingView(); // Render the loading spinner
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <img
          alt="error view"
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
          className="w-[300px] h-[165px] sm:w-[200px] sm:h-[110px] md:w-[250px] md:h-[140px]"
        />
        <h1 className="text-xl font-bold text-red-500 mt-4">Error</h1>
        <p className="text-red-500">{error}</p>
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