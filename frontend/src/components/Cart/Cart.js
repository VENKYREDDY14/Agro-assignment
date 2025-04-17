
import CartListView from '../CartListView/CartListView'
import CartContext from '../../context/CartContext'
import EmptyCartView from '../EmptyCartView/EmptyCartView'
import CartSummary from '../CartSummary/CartSummary'
import Header from '../Header/Header'

const Cart = () => (
  <CartContext.Consumer>
    {value => {
      const {cartList, removeAllCartItems} = value
      const showEmptyView = cartList.length === 0

      const removeAllButton = () => {
        removeAllCartItems()
      }

      return (
        <>
        <Header/>
        <div className="flex justify-center min-h-[75vh] md:min-h-[90vh] pt-20">
          {showEmptyView ? (
            <EmptyCartView />
          ) : (
            <div className="flex flex-col w-[90%] md:w-[80%] max-w-[1110px]">
              <h1 className="text-[#3e4c59] font-roboto font-bold text-[24px] md:text-[48px]">
                My Cart
              </h1>
              <div className="text-right">
                <button
                  className="font-roboto font-bold text-blue-600 border-none bg-transparent"
                  onClick={removeAllButton}
                >
                  Remove All
                </button>
              </div>
              <CartListView />
              <CartSummary />
            </div>
          )}
        </div>
        </>
      )
    }}
  </CartContext.Consumer>
)

export default Cart
