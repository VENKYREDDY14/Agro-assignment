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
  userId: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the user model
    ref: 'user', // Name of the user model
    required: true,
  },
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

const orderModel = mongoose.models.order || mongoose.model('order', orderSchema);

export default orderModel;

