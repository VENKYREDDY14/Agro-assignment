import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  buyer_name: {
    type: String,
    required: true,
    trim: true,
  },
  buyer_contact: {
    type: String,
    required: true,
    trim: true,
  },
  delivery_address: {
    type: String,
    required: true,
    trim: true,
  },
  items: {
    type: Array, // Serialized as JSON
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Delivered'], // Allowed statuses
    default: 'Pending', // Default status
  },
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

const orderModel=mongoose.model.order || mongoose.model('order',orderSchema);

export default orderModel;

