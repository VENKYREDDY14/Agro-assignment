import React, { useState } from 'react';
import CartContext from '../../context/CartContext';
import Header from '../Header/Header';

const produceList = [
    { id: 1, name: "Apple", type: "fruit", price: 200, img: "https://cdn.britannica.com/22/187222-050-07B17FB6/apples-on-a-tree-branch.jpg" },
    { id: 2, name: "Banana", type: "fruit", price: 50, img: "https://via.placeholder.com/150?text=Banana" },
    { id: 3, name: "Carrot", type: "vegetable", price: 40, img: "https://via.placeholder.com/150?text=Carrot" },
    { id: 4, name: "Spinach", type: "vegetable", price: 30, img: "https://via.placeholder.com/150?text=Spinach" },
    { id: 5, name: "Grapes", type: "fruit", price: 120, img: "https://via.placeholder.com/150?text=Grapes" },
    { id: 6, name: "Broccoli", type: "vegetable", price: 150, img: "https://via.placeholder.com/150?text=Broccoli" },
    { id: 7, name: "Mango", type: "fruit", price: 250, img: "https://via.placeholder.com/150?text=Mango" },
    { id: 8, name: "Tomato", type: "vegetable", price: 25, img: "https://via.placeholder.com/150?text=Tomato" },
    { id: 9, name: "Potato", type: "vegetable", price: 20, img: "https://via.placeholder.com/150?text=Potato" },
    { id: 10, name: "Blueberry", type: "fruit", price: 400, img: "https://via.placeholder.com/150?text=Blueberry" }
];

const Products = () => {
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);

    const handleProductClick = (product) => {
        setSelectedProduct(product);
        setQuantity(1); // Reset quantity when opening the popup
    };

    const handleClosePopup = () => {
        setSelectedProduct(null);
    };

    return (
        <CartContext.Consumer>
            {({ addCartItem }) => {
                const handleAddToCart = () => {
                    addCartItem({ ...selectedProduct, quantity });
                    handleClosePopup();
                };

                return (
                    <>
                    <Header/>
                    <div className="p-6 bg-gray-100 min-h-screen pt-20">
                        <h1 className="text-4xl font-bold text-center text-blue-600 mb-8">All Products</h1>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                            {produceList.map((item, index) => (
                                <div
                                    key={index}
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

                        {/* Popup for Product Details */}
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