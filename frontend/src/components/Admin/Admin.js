import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Admin = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', type: '' });
  const [bulkFile, setBulkFile] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null); // State for editing product
  const [editedPrice, setEditedPrice] = useState(''); // State for the edited price
  const fileInputRef = useRef(null);

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const fetchData = async () => {
    try {
      const [ordersResponse, productsResponse] = await Promise.all([
        axios.get(`${backendUrl}/api/admin/orders`),
        axios.get(`${backendUrl}/api/admin/products`),
      ]);
      setOrders(ordersResponse.data);
      setProducts(productsResponse.data);
    } catch (error) {
      toast.error('Failed to fetch data');
    }
  };
  // Fetch orders and products
  useEffect(() => {
    fetchData();
  }, [backendUrl]);

  // Add a new product
  const handleAddProduct = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${backendUrl}/api/admin/products`, newProduct);
      setProducts((prevProducts) => [...prevProducts, response.data]);
      setNewProduct({ name: '', price: '', type: '' });
      toast.success('Product added successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add product');
    }
  };

  // Delete a product
  const handleDeleteProduct = async (productId) => {
    try {
      await axios.delete(`${backendUrl}/api/admin/products/${productId}`);
      setProducts((prevProducts) => prevProducts.filter((product) => product._id !== productId));
      toast.success('Product deleted successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete product');
    }
  };

  // Handle bulk upload
  const handleBulkUpload = async (event) => {
    event.preventDefault();
    if (!bulkFile) {
      toast.error('Please upload a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', bulkFile);

    try {
      const response = await axios.post(`${backendUrl}/api/admin/products/bulk-upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (Array.isArray(response.data)) {
        setProducts((prevProducts) => [...prevProducts, ...response.data]);
        toast.success('Bulk products uploaded successfully');
      } else {
        toast.error('Unexpected response format from server');
      }

      setBulkFile(null);
      fileInputRef.current.value = '';
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload bulk products');
    }
  };

  // Update product price
  const handleUpdatePrice = async (productId, updatedPrice) => {
    try {
      const response = await axios.put(`${backendUrl}/api/admin/update-product/${productId}`, {
        price: updatedPrice,
      });
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === productId ? { ...product, price: response.data.price } : product
        )
      );
      setEditingProduct(null); // Exit editing mode
      setEditedPrice(''); // Clear the edited price
      toast.success('Product price updated successfully');
      fetchData()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update product price');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      {/* Orders Section */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Orders</h2>
        {orders.length > 0 ? (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2">Order ID</th>
                <th className="border border-gray-300 px-4 py-2">Buyer Name</th>
                <th className="border border-gray-300 px-4 py-2">Contact</th>
                <th className="border border-gray-300 px-4 py-2">Address</th>
                <th className="border border-gray-300 px-4 py-2">Total Items</th>
                <th className="border border-gray-300 px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td className="border border-gray-300 px-4 py-2">{order._id}</td>
                  <td className="border border-gray-300 px-4 py-2">{order.buyer_name}</td>
                  <td className="border border-gray-300 px-4 py-2">{order.buyer_contact}</td>
                  <td className="border border-gray-300 px-4 py-2">{order.delivery_address}</td>
                  <td className="border border-gray-300 px-4 py-2">{order.items.length}</td>
                  <td className="border border-gray-300 px-4 py-2">{order.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No orders available</p>
        )}
      </section>

      {/* Products Section */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Products</h2>

        {/* Add Product Form */}
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
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Add Product
          </button>
        </form>

        {/* Bulk Upload Form */}
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

        {/* Products Table */}
        {products.length > 0 ? (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2">Name</th>
                <th className="border border-gray-300 px-4 py-2">Price</th>
                <th className="border border-gray-300 px-4 py-2">Type</th>
                <th className="border border-gray-300 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td className="border border-gray-300 px-4 py-2">{product.name}</td>
                  <td className="border border-gray-300 px-4 py-2">
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
                  <td className="border border-gray-300 px-4 py-2">{product.type}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button
                      onClick={() => {
                        setEditingProduct(product._id);
                        setEditedPrice(product.price); // Set the current price for editing
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
          <p>No products available</p>
        )}
      </section>
    </div>
  );
};

export default Admin;
