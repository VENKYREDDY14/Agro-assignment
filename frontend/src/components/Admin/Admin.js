import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ThreeDots } from 'react-loader-spinner';

const Admin = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', type: '', img: null });
  const [bulkFile, setBulkFile] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editedPrice, setEditedPrice] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const fetchOrders = async () => {
    try {
      const ordersResponse = await axios.get(`${backendUrl}/api/admin/orders`);
      setOrders(ordersResponse.data);
    } catch (error) {
      toast.error('Unable to fetch orders. Please try again later.');
      setError('Unable to fetch orders.');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const productsResponse = await axios.get(`${backendUrl}/api/admin/products`);
      setProducts(productsResponse.data);
    } catch (error) {
      toast.error('Unable to fetch products. Please try again later.');
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, [backendUrl]);

  const handleAddProduct = async (event) => {
    event.preventDefault();

    if (!newProduct.name || !newProduct.price || !newProduct.type || !newProduct.img) {
      toast.error('All fields are required to add a product.');
      return;
    }

    const formData = new FormData();
    formData.append('name', newProduct.name);
    formData.append('price', newProduct.price);
    formData.append('type', newProduct.type);
    formData.append('img', newProduct.img);

    try {
      await axios.post(`${backendUrl}/api/admin/add-products`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Product added successfully.');
      fetchProducts();
      setNewProduct({ name: '', price: '', type: '', img: null });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add product.');
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await axios.delete(`${backendUrl}/api/admin/products/${productId}`);
      setProducts((prevProducts) => prevProducts.filter((product) => product._id !== productId));
      toast.success('Product deleted successfully.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete product.');
    }
  };

  const handleBulkUpload = async (event) => {
    event.preventDefault();

    if (!bulkFile) {
      toast.error('Please upload a CSV file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', bulkFile);

    try {
      await axios.post(`${backendUrl}/api/admin/products/bulk-upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      fetchProducts();
      toast.success('Bulk products uploaded successfully.');
      setBulkFile(null);
      fileInputRef.current.value = '';
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload bulk products.');
    }
  };

  const handleUpdatePrice = async (productId, updatedPrice) => {
    if (!updatedPrice) {
      toast.error('Price cannot be empty.');
      return;
    }

    try {
      // Send the updated price to the backend
      await axios.put(`${backendUrl}/api/admin/update-product/${productId}`, {
        price: updatedPrice,
      });

      // Update the product price in the frontend state directly
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === productId ? { ...product, price: updatedPrice } : product
        )
      );

      setEditingProduct(null);
      setEditedPrice('');
      toast.success('Product price updated successfully.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update product price.');
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`${backendUrl}/api/admin/update-order/${orderId}`, { status: newStatus });
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
      toast.success('Order status updated successfully.');

      const order = orders.find((order) => order._id === orderId);
      if (order) {
        await axios.post(`${backendUrl}/api/admin/send-notification`, {
          email: order.userEmail,
          subject: 'Order Status Update',
          message: `Your order with ID ${orderId} has been updated to ${newStatus}.`,
        });
        toast.success('Notification sent to the user.');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update order status.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <ThreeDots color="#0b69ff" height={50} width={50} />
      </div>
    );
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
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Orders</h2>
        {orders.length > 0 ? (
          <table className="w-full border-collapse border border-gray-300 text-sm md:text-base">
            <thead>
              <tr>
                <th className="border border-gray-300 px-2 py-1 md:px-4 md:py-2">Order ID</th>
                <th className="border border-gray-300 px-2 py-1 md:px-4 md:py-2">User ID</th>
                <th className="border border-gray-300 px-2 py-1 md:px-4 md:py-2">Buyer Name</th>
                <th className="border border-gray-300 px-2 py-1 md:px-4 md:py-2">Contact</th>
                <th className="border border-gray-300 px-2 py-1 md:px-4 md:py-2">Address</th>
                <th className="border border-gray-300 px-2 py-1 md:px-4 md:py-2">Total Items</th>
                <th className="border border-gray-300 px-2 py-1 md:px-4 md:py-2">Ordered Items</th>
                <th className="border border-gray-300 px-2 py-1 md:px-4 md:py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td className="border border-gray-300 px-2 py-1 md:px-4 md:py-2">{order._id}</td>
                  <td className="border border-gray-300 px-2 py-1 md:px-4 md:py-2">{order.userId}</td>
                  <td className="border border-gray-300 px-2 py-1 md:px-4 md:py-2">{order.buyer_name}</td>
                  <td className="border border-gray-300 px-2 py-1 md:px-4 md:py-2">{order.buyer_contact}</td>
                  <td className="border border-gray-300 px-2 py-1 md:px-4 md:py-2">{order.delivery_address}</td>
                  <td className="border border-gray-300 px-2 py-1 md:px-4 md:py-2">{order.items.length}</td>
                  <td className="border border-gray-300 px-2 py-1 md:px-4 md:py-2">
                    <ul>
                      {order.items.map((item, index) => (
                        <li key={index}>
                          {item.name} - {item.quantity}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="border border-gray-300 px-2 py-1 md:px-4 md:py-2">
                    <select
                      value={order.status}
                      onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                      className="border border-gray-300 px-2 py-1"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">In Progress</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No orders available.</p>
        )}
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-2">Products</h2>
        <form onSubmit={handleAddProduct} className="mb-4 flex flex-wrap gap-2">
          <input
            type="text"
            placeholder="Name"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            required
            className="border border-gray-300 px-2 py-1"
          />
          <input
            type="number"
            placeholder="Price"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
            required
            className="border border-gray-300 px-2 py-1"
          />
          <select
            value={newProduct.type}
            onChange={(e) => setNewProduct({ ...newProduct, type: e.target.value })}
            required
            className="border border-gray-300 px-2 py-1"
          >
            <option value="">Select Type</option>
            <option value="fruit">Fruit</option>
            <option value="vegetable">Vegetable</option>
          </select>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setNewProduct({ ...newProduct, img: e.target.files[0] })}
            required
            className="border border-gray-300 px-2 py-1"
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Add Product
          </button>
        </form>
        <form onSubmit={handleBulkUpload} className="mb-4">
          <input
            type="file"
            accept=".csv"
            onChange={(e) => setBulkFile(e.target.files[0])}
            ref={fileInputRef}
            className="border border-gray-300 px-2 py-1 mr-2"
          />
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
            Upload Bulk Products
          </button>
        </form>
        {products.length > 0 ? (
          <table className="w-full border-collapse border border-gray-300 text-sm md:text-base">
            <thead>
              <tr>
                <th className="border border-gray-300 px-2 py-1 md:px-4 md:py-2">Name</th>
                <th className="border border-gray-300 px-2 py-1 md:px-4 md:py-2">Price</th>
                <th className="border border-gray-300 px-2 py-1 md:px-4 md:py-2">Type</th>
                <th className="border border-gray-300 px-2 py-1 md:px-4 md:py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td className="border border-gray-300 px-2 py-1 md:px-4 md:py-2">{product.name}</td>
                  <td className="border border-gray-300 px-2 py-1 md:px-4 md:py-2">
                    {editingProduct === product._id ? (
                      <>
                        <input
                          type="number"
                          value={editedPrice}
                          onChange={(e) => setEditedPrice(e.target.value)}
                          className="border border-gray-300 px-2 py-1"
                        />
                        <button
                          onClick={() => handleUpdatePrice(product._id, editedPrice)}
                          className="bg-green-500 text-white px-2 py-1 rounded ml-2"
                        >
                          Save
                        </button>
                      </>
                    ) : (
                      `₹${product.price}`
                    )}
                  </td>
                  <td className="border border-gray-300 px-2 py-1 md:px-4 md:py-2">{product.type}</td>
                  <td className="border border-gray-300 px-2 py-1 md:px-4 md:py-2">
                    <button
                      onClick={() => {
                        setEditingProduct(product._id);
                        setEditedPrice(product.price);
                      }}
                      className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                    >
                      Edit Price
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product._id)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No products available.</p>
        )}
      </section>
    </div>
  );
};

export default Admin;