import {Link} from 'react-router-dom'

const EmptyCartView = () => (
  <div className="flex flex-col items-center self-center">
    <img
      src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-empty-cart-img.png"
      alt="cart empty"
      className="w-[180px] h-[190px] md:w-[360px] md:h-[380px]"
    />
    <h1 className="text-[#1e293b] font-roboto font-medium text-[24px] md:text-[32px] mt-4">
      Your Cart Is Empty
    </h1>
    <Link to="/products">
      <button
        type="button"
        className="bg-[#0b69ff] text-white font-roboto text-[12px] rounded-lg px-4 py-2 mt-4 outline-none cursor-pointer"
      >
        Shop Now
      </button>
    </Link>
  </div>
)

export default EmptyCartView
