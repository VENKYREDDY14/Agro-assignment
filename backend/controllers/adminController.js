import Product from '../models/productModel.js';
import csv from 'csv-parser';
import fs from 'fs';
import Order from '../models/orderModel.js';
import User from '../models/userModel.js';
import cloudinary from 'cloudinary';
import nodemailer from 'nodemailer';

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail', // Use your email service (e.g., Gmail, Outlook, etc.)
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // Your email password or app-specific password
  },
});

// Bulk upload products with Cloudinary image upload
export const bulkUploadProducts = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No CSV file uploaded' });
    }

    const products = [];
    console.log(`Processing CSV file: ${req.file.path}`);

    // Read and parse the CSV file
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on('data', (row) => {
        if (row.name && row.price && row.type) {
          products.push({
            name: row.name,
            price: parseFloat(row.price),
            type: row.type,
           
          });
        } else {
          console.warn('Invalid row skipped:', row);
        }
      })
      .on('end', async () => {
        try {
          console.log(`Parsed ${products.length} valid products from CSV`);

         
          const savedProducts = await Product.insertMany(products);
          console.log('Products successfully saved to the database');
          res.status(201).json({ message: 'Products uploaded successfully', products: savedProducts });
        } catch (error) {
          console.error('Error saving products:', error.message);
          res.status(500).json({ message: 'Failed to save products to the database' });
        } finally {
          fs.unlinkSync(req.file.path); // Delete the CSV file after processing
          console.log('CSV file deleted after processing');
        }
      });
  } catch (error) {
    console.error('Error processing bulk upload:', error.message);
    res.status(500).json({ message: 'Server error while processing bulk upload' });
  }
};

// Add a single product with Cloudinary image upload
export const addProduct = async (req, res) => {
  const { name, price, type } = req.body;

  try {
    if (!name || !price || !type || !req.file) {
      return res.status(400).json({ message: 'All fields (name, price, type, image) are required' });
    }

    // Upload image to Cloudinary
    const result = await cloudinary.v2.uploader.upload(req.file.path, {
      folder: 'products',
    });

    const newProduct = new Product({
      name,
      price: parseFloat(price),
      type,
      img: result.secure_url, // Store the Cloudinary image URL in the database
    });

    const savedProduct = await newProduct.save();
    res.status(201).json({ message: 'Product added successfully', product: savedProduct });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'Product with this name already exists' });
    } else {
      console.error('Error adding product:', error.message);
      res.status(500).json({ message: 'Server error while adding product' });
    }
  }
};

// Delete a product by ID
export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product deleted successfully', product: deletedProduct });
  } catch (error) {
    console.error('Error deleting product:', error.message);
    res.status(500).json({ message: 'Server error while deleting product' });
  }
};

// Fetch all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error.message);
    res.status(500).json({ message: 'Server error while fetching products' });
  }
};

// Fetch all orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error.message);
    res.status(500).json({ message: 'Server error while fetching orders' });
  }
};

// Update a product by ID
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, type } = req.body;

  try {
    if (!name && !price && !type) {
      return res.status(400).json({ message: 'At least one field (name, price, type) is required to update' });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { ...(name && { name }), ...(price && { price }), ...(type && { type }) },
      { new: true } // Return the updated document
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
  } catch (error) {
    console.error('Error updating product:', error.message);
    res.status(500).json({ message: 'Server error while updating product' });
  }
};

// Update order status by ID and send email notification
export const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true } // Return the updated document
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Fetch the user associated with the order
    const user = await User.findById(updatedOrder.userId);
    if (user && user.gmail) {
      // Send email notification to the user
      const mailOptions = {
        from: process.env.EMAIL_USER, // Sender email address
        to: user.gmail, // Recipient email address
        subject: 'Order Status Update',
        html: `
          <h1>Order Status Update</h1>
          <p>Dear ${user.username},</p>
          <p>Your order with ID <strong>${updatedOrder._id}</strong> has been updated to <strong>${status}</strong>.</p>
          <p>Thank you for shopping with us!</p>
        `,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(`Error sending email: ${error.message}`);
        } else {
          console.log(`Email sent: ${info.response}`);
        }
      });
    }

    res.status(200).json({ message: 'Order status updated successfully', order: updatedOrder });
  } catch (error) {
    console.error('Error updating order status:', error.message);
    res.status(500).json({ message: 'Server error while updating order status' });
  }
};