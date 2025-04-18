import React, { useState } from 'react';
import CartContext from '../../context/CartContext';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CartSummary = () => {
  const [showOrderForm, setShowOrderForm] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const handlePlaceOrder = async (data, cartList) => {
    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        navigate('/login');
        return;
      }

      const orderData = {
        ...data,
        items: cartList,
        status: 'Pending',
      };

      await axios.post(`${backendUrl}/api/user/place-order`, orderData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      setShowOrderForm(false);
      reset();
    } catch (error) {
      console.error('Error placing order:', error.message);
    }
  };

  return (
    <CartContext.Consumer>
      {({ cartList }) => {
        const totalCost = cartList.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0
        );

        return (
          <div className="flex flex-col justify-center items-end bg-gray-100 p-6 rounded-lg shadow-md">
            <div>
              <h1 className="text-lg font-medium text-gray-700 mb-2">
                Order Total: <span className="text-black font-bold">Rs {totalCost}/-</span>
              </h1>
              <p className="text-sm text-gray-600 mb-4">{cartList.length} items in cart</p>
              {!showOrderForm ? (
                <button
                  onClick={() => setShowOrderForm(true)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-colors"
                >
                  Place Order
                </button>
              ) : (
                <form
                  onSubmit={handleSubmit((data) => handlePlaceOrder(data, cartList))}
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
                      reset();
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