import { BsPlusSquare, BsDashSquare } from 'react-icons/bs';
import { AiFillCloseCircle } from 'react-icons/ai';

import CartContext from '../../context/CartContext';

const CartItem = (props) => (
  <CartContext.Consumer>
    {(value) => {
      const {
        removeCartItem,
        decrementCartItemQuantity,
        incrementCartItemQuantity,
      } = value;
      const { cartItemDetails } = props;
      const { id, title, brand, quantity, price, imageUrl } = cartItemDetails;

      const onRemoveCartItem = () => {
        removeCartItem(id);
      };

      const decrementQuantity = () => {
        decrementCartItemQuantity(id, quantity);
      };

      const incrementQuantity = () => {
        incrementCartItemQuantity(id, quantity);
      };

      return (
        <li className="flex items-center bg-white p-4 mb-4 shadow-md rounded-lg md:p-6 md:mb-8">
          <img
            className="w-24 h-24 rounded-lg"
            src={imageUrl}
            alt={title}
          />
          <div className="ml-4 flex-grow">
            <div className="mb-2">
              <p className="text-gray-900 font-medium text-sm md:text-base">
                {title}
              </p>
              <p className="text-gray-500 text-xs md:text-sm">by {brand}</p>
            </div>
            <div className="flex items-center mb-2">
              <button
                data-testid="minus"
                type="button"
                className="p-1"
                onClick={decrementQuantity}
              >
                <BsDashSquare className="text-gray-600 w-4 h-4" />
              </button>
              <p className="mx-2 text-gray-700 font-medium text-sm md:text-base">
                {quantity}
              </p>
              <button
                data-testid="plus"
                type="button"
                className="p-1"
                onClick={incrementQuantity}
              >
                <BsPlusSquare className="text-gray-600 w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-blue-600 font-medium text-sm md:text-base">
                Rs {price * quantity}/-
              </p>
              <button
                data-testid="remove"
                className="text-gray-600 text-xs md:hidden"
                type="button"
                onClick={onRemoveCartItem}
              >
                Remove
              </button>
            </div>
          </div>
          <button
            className="ml-8 hidden md:block"
            type="button"
            onClick={onRemoveCartItem}
          >
            <AiFillCloseCircle className="text-gray-600 w-5 h-5" />
          </button>
        </li>
      );
    }}
  </CartContext.Consumer>
);

export default CartItem;