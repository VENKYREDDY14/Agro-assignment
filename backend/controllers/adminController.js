import Product from '../models/productModel.js';
import csv from 'csv-parser';
import fs from 'fs';
import Order from '../models/orderModel.js'; // Ensure you have an Order model

// Bulk upload products with image upload
export const bulkUploadProducts = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No CSV file uploaded' });
    }

    const products = [];

    // Read and parse the CSV file
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on('data', (row) => {
        if (row.name && row.price && row.type) {
          products.push({
            name: row.name,
            price: parseFloat(row.price),
            type: row.type,
            img: row.img || undefined, // Use the provided image or let the model apply the default
          });
        }
      })
      .on('end', async () => {
        try {
          const savedProducts = await Product.insertMany(products);
          res.status(201).json({ message: 'Products uploaded successfully', products: savedProducts });
        } catch (error) {
          console.error('Error saving products:', error.message);
          res.status(500).json({ message: 'Failed to save products to the database' });
        } finally {
          fs.unlinkSync(req.file.path); // Delete the CSV file after processing
        }
      });
  } catch (error) {
    console.error('Error processing bulk upload:', error.message);
    res.status(500).json({ message: 'Server error while processing bulk upload' });
  }
};

// Add a single product with image upload
export const addProduct = async (req, res) => {
  const { name, price, type } = req.body;

  try {
    if (!name || !price || !type || !req.file) {
      return res.status(400).json({ message: 'All fields (name, price, type, image) are required' });
    }

    const newProduct = new Product({
      name,
      price: parseFloat(price),
      type,
      img: req.file.path, // Store the uploaded image path in the database
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
    // Validate input
    if (!name && !price && !type) {
      return res.status(400).json({ message: 'At least one field (name, price, type) is required to update' });
    }

    // Find and update the product
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