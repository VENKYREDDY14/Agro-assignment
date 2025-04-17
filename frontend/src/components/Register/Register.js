import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const Register = () => {
  const [number, setNumber] = useState('');
  const [gmail, setGmail] = useState('');
  const [username, setUsername] = useState('');
  const [isOtp, setOtpStatus] = useState(false);
  const [otp, setOtp] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // Updated to store specific error messages
  const [isOtpStatusValid, setOtpValidStatus] = useState(false);
  const [otpTimeout, setOtpTimeout] = useState(null);
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const removeDetails = async () => {
    try {
      await axios.delete(`${backendUrl}/api/user/users/${gmail}`);
    } catch (error) {
      console.error('Error removing user details:', error);
    }
  };

  const onVerifyingOtp = async (event) => {
    event.preventDefault();
    const OTP = { otp, gmail };

    try {
      const response = await axios.post(`${backendUrl}/api/user/verify-user`, OTP);
      if (response.status === 200) {
        setOtpValidStatus(false);
        clearTimeout(otpTimeout);
        navigate('/login', { replace: true });
        toast.success('Account created successfully');
      }
    } catch (error) {
      setOtpValidStatus(true);
      toast.error('Invalid OTP');
    }
  };

  const onSendingDetails = async (event) => {
    event.preventDefault();

    const userDetails = { number, gmail, username, password };

    try {
      const response = await axios.post(`${backendUrl}/api/user/register`, userDetails);
      if (response.status === 201) {
        setOtpStatus(true);
        toast.success('OTP sent successfully');
        setErrorMessage(''); // Clear any previous error message
        const timeout = setTimeout(removeDetails, 2 * 60 * 1000);
        setOtpTimeout(timeout);
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMessage(error.response.data.message); // Set specific error message from backend
      } else {
        setErrorMessage('Something went wrong. Please try again.');
      }
      toast.error('Failed to send OTP');
    }
  };

  useEffect(() => {
    return () => clearTimeout(otpTimeout);
  }, [otpTimeout]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-lg p-8">
        <h1 className="text-2xl font-bold text-center text-blue-600 mb-6">Register</h1>
        <form onSubmit={isOtp ? onVerifyingOtp : onSendingDetails} className="space-y-6">
          <div>
            <label htmlFor="gmail" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="gmail"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              onChange={(event) => setGmail(event.target.value)}
              value={gmail}
              required
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label htmlFor="number" className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="text"
              id="number"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              onChange={(event) => setNumber(event.target.value)}
              value={number}
              required
              placeholder="Enter your phone number"
            />
          </div>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              onChange={(event) => setUsername(event.target.value)}
              value={username}
              required
              placeholder="Choose a username"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              onChange={(event) => setPassword(event.target.value)}
              value={password}
              required
              placeholder="Create a password"
            />
          </div>
          {isOtp && (
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                OTP
              </label>
              <input
                type="text"
                id="otp"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                onChange={(event) => setOtp(event.target.value)}
                value={otp}
                required
                placeholder="Enter the OTP sent to your email"
              />
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {isOtp ? 'Verify OTP' : 'Register'}
          </button>
          {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}
          {isOtpStatusValid && <p className="text-red-500 text-center">Invalid OTP!</p>}
        </form>
      </div>
    </div>
  );
};

export default Register;