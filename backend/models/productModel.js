import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true, // Ensure product names are unique
  },
  price: {
    type: Number,
    required: true,
    min: 0, // Ensure price is non-negative
  },
  type: {
    type: String,
    required: true,
    trim: true,
  },
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields


const productModel=mongoose.model.product || mongoose.model('product',productSchema);

export default productModel;