import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const navItems = [
    { id: "HOME", displayText: "Home", path: "/" },
    { id: "PRODUCTS", displayText: "Products", path: "/products" },
    { id: "CART", displayText: "Cart", path: "/cart" },
    { id: "STATUS", displayText: "Status", path: "/status" },
];

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('jwtToken'));
    const navigate = useNavigate();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem('jwtToken');
        setIsLoggedIn(false);
        navigate('/');
    };

    useEffect(() => {
        setIsLoggedIn(!!localStorage.getItem('jwtToken'));
    }, []);

    return (
        <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 py-4 bg-blue-600 text-white shadow-md">
            <div className="text-2xl font-bold cursor-pointer" onClick={() => navigate('/')}>
                <span className="text-yellow-400">Fruit</span>Mart
            </div>

            <button
                className="block md:hidden text-white focus:outline-none"
                onClick={toggleMenu}
            >
                <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 6h16M4 12h16M4 18h16"
                    ></path>
                </svg>
            </button>

            <nav
                className={`${
                    isMenuOpen ? "block" : "hidden"
                } absolute top-16 left-0 w-full bg-blue-600 md:static md:block z-50`}
            >
                <ul className="flex flex-col md:flex-row md:gap-6 md:items-center md:justify-end">
                    {navItems.map((item) => (
                        <li
                            onClick={() => {
                                setIsMenuOpen(false);
                                navigate(item.path);
                            }}
                            key={item.id}
                            className="py-2 px-4 md:py-0 md:px-0 hover:text-yellow-400 cursor-pointer transition-colors"
                        >
                            {item.displayText}
                        </li>
                    ))}
                    <li className="py-2 px-4 md:py-0 md:px-0">
                        {isLoggedIn ? (
                            <button
                                onClick={handleLogout}
                                className="bg-white text-blue-600 px-4 py-2 rounded-lg shadow hover:bg-gray-100 transition w-full md:w-auto"
                            >
                                Logout
                            </button>
                        ) : (
                            <Link
                                to="/login"
                                className="bg-white text-blue-600 px-4 py-2 rounded-lg shadow hover:bg-gray-100 transition w-full md:w-auto"
                            >
                                Login
                            </Link>
                        )}
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;