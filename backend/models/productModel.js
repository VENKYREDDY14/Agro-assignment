import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  type: {
    type: String,
    required: true,
    trim: true,
  },
  img: {
    type: String,
    required: true,
    trim: true,
    default: function () {
      const type = this.type.toLowerCase();
      if (type === 'fruit') {
        return 'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?auto=format&fit=crop&w=600&q=80';
      } else if (type === 'vegetable') {
        return 'https://images.unsplash.com/photo-1518977956815-dee0061a4293?auto=format&fit=crop&w=600&q=80';
      } else {
        return 'https://via.placeholder.com/150?text=Product+Image';
      }
    },
  },
}, { timestamps: true });

const productModel = mongoose.models.product || mongoose.model('product', productSchema);

export default productModel;
