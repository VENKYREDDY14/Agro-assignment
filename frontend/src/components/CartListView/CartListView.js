import CartItem from '../CartItem/CartItem';
import CartContext from '../../context/CartContext';

const CartListView = () => (
  <CartContext.Consumer>
    {(value) => {
      const { cartList } = value;

      return (
        <ul className="list-none p-0">
          {cartList.map((eachCartItem) => (
            <CartItem key={eachCartItem.id} cartItemDetails={eachCartItem} />
          ))}
        </ul>
      );
    }}
  </CartContext.Consumer>
);

export default CartListView;