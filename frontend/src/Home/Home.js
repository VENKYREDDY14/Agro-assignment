import { Link } from 'react-router-dom'
import homeImage from '../assets/home.png'; 


const Home = () => (
  <div className="flex flex-col items-center justify-center w-[90%] max-w-[1110px] mx-auto pt-2 pb-12 md:flex-row md:justify-between md:pt-24">
    <div className="flex flex-col items-center md:items-start mt-[70px] md:mt-0">
      <h1 className="text-[#1e293b] font-bold text-[30px] leading-[1.2] text-center md:text-[46px] md:text-left">
      Fresh Produce That Gets YOU Healthy
      </h1>
      <img
        src={homeImage}
        alt="clothes that get you noticed"
        className="w-[206px] md:hidden"
      />
      <p className="font-roboto text-[14px] leading-7 text-[#64748b] mt-9 mb-0 text-center md:text-[18px] md:mt-0 md:text-left">
      At FruitMart, we believe that fresh and organic produce is the key to a healthy lifestyle. Fruits and vegetables have always been a symbol of vitality and well-being. Celebrate the goodness of nature with our wide range of fresh produce, sourced directly from trusted farms and delivered to your doorstep.
      </p>
      <Link to="/products">
        <button
          type="button"
          className="text-white text-[14px] md:text-[16px] font-normal font-roboto bg-[#0967d2] py-3 px-6 rounded-lg mt-5 cursor-pointer focus:outline-none w-auto md:w-[150px]"
        >
          Shop Now
        </button>
      </Link>
    </div>
    <img
      src={homeImage}
      alt="clothes that get you noticed"
      className="hidden md:block w-1/2 max-w-[450px] ml-[85px]"
    />
  </div>
)

export default Home
