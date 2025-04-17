import React from 'react';

const produceList = [
    { name: "Apple", type: "fruit", price: 200, img: "https://www.google.com/imgres?q=apple%20photos&imgurl=https%3A%2F%2Fcdn.britannica.com%2F22%2F187222-050-07B17FB6%2Fapples-on-a-tree-branch.jpg&imgrefurl=https%3A%2F%2Fwww.britannica.com%2Fplant%2Fapple-fruit-and-tree&docid=DwSLVYjjFj8bjM&tbnid=med3JNdcefxBYM&vet=12ahUKEwiGwNO1396MAxWkklYBHSKlK8YQM3oECBcQAA..i&w=1600&h=1102&hcb=2&ved=2ahUKEwiGwNO1396MAxWkklYBHSKlK8YQM3oECBcQAA" },
    { name: "Banana", type: "fruit", price: 50, img: "https://via.placeholder.com/150?text=Banana" },
    { name: "Carrot", type: "vegetable", price: 40, img: "https://via.placeholder.com/150?text=Carrot" },
    { name: "Spinach", type: "vegetable", price: 30, img: "https://via.placeholder.com/150?text=Spinach" },
    { name: "Grapes", type: "fruit", price: 120, img: "https://via.placeholder.com/150?text=Grapes" },
    { name: "Broccoli", type: "vegetable", price: 150, img: "https://via.placeholder.com/150?text=Broccoli" },
    { name: "Mango", type: "fruit", price: 250, img: "https://via.placeholder.com/150?text=Mango" },
    { name: "Tomato", type: "vegetable", price: 25, img: "https://via.placeholder.com/150?text=Tomato" },
    { name: "Potato", type: "vegetable", price: 20, img: "https://via.placeholder.com/150?text=Potato" },
    { name: "Blueberry", type: "fruit", price: 400, img: "https://via.placeholder.com/150?text=Blueberry" }
];

const Products = () => {
    return (
        <div className="p-6 bg-gray-100 min-h-screen pt-20">
            <h1 className="text-4xl font-bold text-center text-blue-600 mb-8">All Products</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {produceList.map((item, index) => (
                    <div
                        key={index}
                        className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow transform hover:scale-105"
                    >
                        <img
                            src="https://cdn.britannica.com/22/187222-050-07B17FB6/apples-on-a-tree-branch.jpg"
                            alt={item.name}
                            className="w-full h-40 object-cover rounded-md mb-4"
                        />
                        <h2 className="text-2xl font-semibold text-gray-800 mb-2">{item.name}</h2>

                        <p className="text-gray-500 capitalize mb-4">{item.type}</p>

                        <p className="text-blue-600 font-bold text-lg">₹{item.price.toLocaleString()}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Products;