import CartItem from '../CartItem/CartItem';
import CartContext from '../../context/CartContext';

const CartListView = () => (
  <CartContext.Consumer>
    {({ cartList }) => (
      <ul className="list-none p-0">
        {cartList.map((item) => (
          <CartItem key={item._id} cartItemDetails={item} />
        ))}
      </ul>
    )}
  </CartContext.Consumer>
);

export default CartListView;