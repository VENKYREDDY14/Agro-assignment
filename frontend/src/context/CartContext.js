import React from 'react';

const CartContext = React.createContext({
  cartList: [],
  addCartItem: () => {},
  incrementCartItemQuantity: () => {},
  decrementCartItemQuantity: () => {},
  removeCartItem: () => {},
  removeAllCartItems: () => {},
});

export default CartContext;