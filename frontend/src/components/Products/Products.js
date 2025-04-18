import React, { useState, useEffect } from 'react';
import CartContext from '../../context/CartContext';
import axios from 'axios';
import { ThreeDots } from 'react-loader-spinner';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/user/products`);
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error.message);
        setError('Failed to fetch products. Please try again.');
        setLoading(false);
      }
    };

    fetchProducts();
  }, [backendUrl]);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setQuantity(1);
  };

  const handleClosePopup = () => {
    setSelectedProduct(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <ThreeDots color="#0b69ff" height={50} width={50} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <img
          alt="error view"
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
          className="w-[300px] h-[165px] sm:w-[200px] sm:h-[110px] md:w-[250px] md:h-[140px]"
        />
        <h1 className="text-xl font-bold text-red-500 mt-4">Error</h1>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <CartContext.Consumer>
      {({ cartList, addCartItem, incrementCartItemQuantity }) => {
        const handleAddToCart = () => {
          addCartItem({ ...selectedProduct, quantity });

          handleClosePopup();
        };

        return (
          <>
            <div className="p-6 bg-gray-100 min-h-screen pt-20">
              <h1 className="text-4xl font-bold text-center text-blue-600 mb-8">All Products</h1>

              {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                  {products.map((item) => (
                    <div
                      key={item._id}
                      className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow transform hover:scale-105 cursor-pointer"
                      onClick={() => handleProductClick(item)}
                    >
                      <img
                        src={item.img}
                        alt={item.name}
                        className="w-full h-40 object-cover rounded-md mb-4"
                      />
                      <h2 className="text-2xl font-semibold text-gray-800 mb-2">{item.name}</h2>
                      <p className="text-gray-500 capitalize mb-4">{item.type}</p>
                      <p className="text-blue-600 font-bold text-lg">₹{item.price.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 text-lg">No products available at the moment.</p>
              )}

              {selectedProduct && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg shadow-lg p-6 w-96">
                    <button
                      className="text-gray-500 hover:text-gray-700 float-right"
                      onClick={handleClosePopup}
                    >
                      ✖
                    </button>
                    <img
                      src={selectedProduct.img}
                      alt={selectedProduct.name}
                      className="w-full h-40 object-cover rounded-md mb-4"
                    />
                    <h2 className="text-2xl font-semibold text-gray-800 mb-2">{selectedProduct.name}</h2>
                    <p className="text-gray-500 capitalize mb-4">{selectedProduct.type}</p>
                    <p className="text-blue-600 font-bold text-lg mb-4">₹{selectedProduct.price.toLocaleString()}</p>
                    <div className="flex items-center mb-4">
                      <button
                        className="px-3 py-1 bg-gray-200 rounded-l-lg hover:bg-gray-300"
                        onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                      >
                        -
                      </button>
                      <p className="px-4">{quantity}</p>
                      <button
                        className="px-3 py-1 bg-gray-200 rounded-r-lg hover:bg-gray-300"
                        onClick={() => setQuantity((prev) => prev + 1)}
                      >
                        +
                      </button>
                    </div>
                    <button
                      className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                      onClick={handleAddToCart}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        );
      }}
    </CartContext.Consumer>
  );
};

export default Products;