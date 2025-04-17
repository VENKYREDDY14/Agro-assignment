import React, { useState } from 'react';
import CartContext from '../../context/CartContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

const CartSummary = () => {
  const [showOrderForm, setShowOrderForm] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const handlePlaceOrder = async (data, cartList, totalCost) => {
    try {
      const token = localStorage.getItem('jwtToken'); // Check for the token
      if (!token) {
        toast.error('You must be logged in to place an order');
        navigate('/login'); // Redirect to login page
        return;
      }

      const orderData = {
        ...data,
        items: cartList,
        totalCost, // Include total cost in the order
        status: 'Pending',
      };

      const response = await axios.post(`${backendUrl}/api/user/place-order`, orderData, {
        headers: {
          Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
        },
      });

      if (response.status === 201) {
        toast.success('Order placed successfully!');
        setShowOrderForm(false);
        reset(); // Reset the form after successful submission
      } else {
        toast.error('Unexpected response from the server');
      }
    } catch (error) {
      console.error('Error placing order:', error.response || error.message);
      toast.error(error.response?.data?.message || 'Failed to place order. Please try again.');
    }
  };

  return (
    <CartContext.Consumer>
      {(value) => {
        const { cartList } = value;
        const cartListLength = cartList.length;
        const totalCost = cartList.reduce((acc, eachItem) => {
          return acc + eachItem.price * eachItem.quantity;
        }, 0);

        return (
          <div className="flex flex-col justify-center items-end bg-gray-100 p-6 rounded-lg shadow-md">
            <div>
              <h1 className="text-lg font-medium text-gray-700 mb-2">
                Order Total: <span className="text-black font-bold">Rs {totalCost}/-</span>
              </h1>
              <p className="text-sm text-gray-600 mb-4">{cartListLength} items in cart</p>
              {!showOrderForm ? (
                <button
                  onClick={() => setShowOrderForm(true)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-colors"
                >
                  Place Order
                </button>
              ) : (
                <form
                  onSubmit={handleSubmit((data) => handlePlaceOrder(data, cartList, totalCost))}
                  className="flex flex-col gap-4"
                >
                  <input
                    type="text"
                    {...register('buyer_name', { required: 'Name is required' })}
                    placeholder="Enter your name"
                    className="border border-gray-300 px-4 py-2 rounded-md"
                  />
                  {errors.buyer_name && (
                    <p className="text-red-500 text-sm">{errors.buyer_name.message}</p>
                  )}

                  <input
                    type="text"
                    {...register('buyer_contact', {
                      required: 'Contact number is required',
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: 'Enter a valid 10-digit contact number',
                      },
                    })}
                    placeholder="Enter your contact number"
                    className="border border-gray-300 px-4 py-2 rounded-md"
                  />
                  {errors.buyer_contact && (
                    <p className="text-red-500 text-sm">{errors.buyer_contact.message}</p>
                  )}

                  <textarea
                    {...register('delivery_address', { required: 'Delivery address is required' })}
                    placeholder="Enter your delivery address"
                    className="border border-gray-300 px-4 py-2 rounded-md"
                  />
                  {errors.delivery_address && (
                    <p className="text-red-500 text-sm">{errors.delivery_address.message}</p>
                  )}

                  <button
                    type="submit"
                    className="bg-green-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-green-700 transition-colors"
                  >
                    Confirm Order
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowOrderForm(false);
                      reset(); // Reset the form when canceled
                    }}
                    className="bg-red-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-red-700 transition-colors"
                  >
                    Cancel
                  </button>
                </form>
              )}
            </div>
          </div>
        );
      }}
    </CartContext.Consumer>
  );
};

export default CartSummary;