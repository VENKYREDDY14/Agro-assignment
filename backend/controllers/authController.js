import User from '../models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import validator from 'validator';
import Order from '../models/orderModel.js';

// Generate OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail', // Use your email service (e.g., Gmail, Outlook, etc.)
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // Your email password or app-specific password
  },
});

// Register a new user
export const registerUser = async (req, res) => {
  const { username, gmail, number, password, role } = req.body;

  try {
    // Validate email
    if (!validator.isEmail(gmail)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Validate password (e.g., minimum 8 characters, at least one letter and one number)
    if (!validator.isStrongPassword(password, { minLength: 8, minLowercase: 1, minUppercase: 0, minNumbers: 1, minSymbols: 0 })) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters long and include at least one letter and one number',
      });
    }

    // Check if the email (gmail) already exists
    const existingUser = await User.findOne({ gmail });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP and expiry time
    const otp = generateOtp();
    const otpExpiresAt = new Date(Date.now() + 2 * 60 * 1000); // OTP expires in 2 minutes

    // Create a new user
    const newUser = new User({
      username,
      gmail,
      number,
      password: hashedPassword,
      role: role || 'user', // Default role is 'user'
      otp,
      otpExpiresAt,
    });

    // Save the user to the database
    await newUser.save();

    // Send OTP via email
    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender email address
      to: gmail, // Recipient email address
      subject: 'Your OTP for Registration',
      text: `Your OTP is ${otp}. It is valid for 2 minutes.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(`Error sending email: ${error.message}`);
        return res.status(500).json({ message: 'Failed to send OTP email' });
      } else {
        console.log(`Email sent: ${info.response}`);
        res.status(201).json({ message: 'User registered successfully. OTP sent to email.' });
      }
    });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

// Verify OTP
export const verifyOtp = async (req, res) => {
  const { gmail, otp } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ gmail });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the OTP matches and is not expired
    if (user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (user.otpExpiresAt < Date.now()) {
      return res.status(400).json({ message: 'OTP has expired' });
    }

    // OTP is valid; clear OTP fields
    user.otp = null;
    user.otpExpiresAt = null;
    await user.save();

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({ message: 'OTP verified successfully', token });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete user details if not verified within a minute
export const deleteUnverifiedUser = async (req, res) => {
  const { gmail } = req.params;

  try {
    // Find the user by email
    const user = await User.findOne({ gmail });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the OTP has expired
    if (user.otpExpiresAt && user.otpExpiresAt < Date.now()) {
      // Delete the user if OTP has expired
      await User.deleteOne({ gmail });
      return res.status(200).json({ message: 'Unverified user deleted successfully' });
    }

    res.status(400).json({ message: 'User is either verified or OTP has not expired yet' });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login user
export const loginUser = async (req, res) => {
  const { gmail, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ gmail });
    if (!user) {
      return res.status(404).json({ message: 'Invalid email or password' });
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user._id,role:user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

    // Respond with the token and user details
    res.status(200).json({
      message: 'Login successful',
      jwtToken: token,
      id: user._id,
      gmail: user.gmail,
      username: user.username,
      role: user.role || 'user', // Default role is 'user' if not specified
    });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

// Place an order
export const placeOrder = async (req, res) => {
  const { buyer_name, buyer_contact, delivery_address, items, status } = req.body;

  try {
    // Validate required fields
    if (!buyer_name || !buyer_contact || !delivery_address || !items || items.length === 0) {
      return res.status(400).json({ message: 'All fields (buyer_name, buyer_contact, delivery_address, items) are required' });
    }

    // Create a new order
    const newOrder = new Order({
      buyer_name,
      buyer_contact,
      delivery_address,
      items,
      status: status || 'Pending', // Default status is 'Pending'
    });

    // Save the order to the database
    const savedOrder = await newOrder.save();

    res.status(201).json({ message: 'Order placed successfully', order: savedOrder });
  } catch (error) {
    console.error('Error placing order:', error.message);
    res.status(500).json({ message: 'Server error while placing order' });
  }
};
