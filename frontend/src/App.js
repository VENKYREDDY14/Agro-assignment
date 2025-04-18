import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Products from './components/Products/Products';
import Home from './components/Home/Home';
import Cart from './components/Cart/Cart';
import Login from './components/Login/Login';
import CartContext from './context/CartContext';
import Register from './components/Register/Register';
import Admin from './components/Admin/Admin';
import Status from './components/Status/Status';
import Layout from './components/Layout/Layout'; // Import the new Layout component
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const [cartList, setCartList] = useState([]);

  // Add a product to the cart
  const addCartItem = (product) => {
    const productInCart = cartList.find((item) => item.id === product.id);
    if (productInCart) {
      setCartList((prevCartList) =>
        prevCartList.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + product.quantity }
            : item
        )
      );
    } else {
      setCartList((prevCartList) => [...prevCartList, product]);
    }
  };

  // Increment the quantity of a product in the cart
  const incrementCartItemQuantity = (id) => {
    setCartList((prevCartList) =>
      prevCartList.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  // Decrement the quantity of a product in the cart
  const decrementCartItemQuantity = (id) => {
    setCartList((prevCartList) =>
      prevCartList
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // Remove a product from the cart
  const removeCartItem = (id) => {
    setCartList((prevCartList) =>
      prevCartList.filter((item) => item.id !== id)
    );
  };

  // Remove all products from the cart
  const removeAllCartItems = () => {
    setCartList([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartList,
        addCartItem,
        incrementCartItemQuantity,
        decrementCartItemQuantity,
        removeCartItem,
        removeAllCartItems,
      }}
    >
      <div>
        <ToastContainer />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<Layout />}> {/* Wrap these routes with Layout */}
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/status" element={<Status />} />
          </Route>
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
      </div>
    </CartContext.Provider>
  );
};

export default App;
