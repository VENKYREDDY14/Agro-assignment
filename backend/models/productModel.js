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
        return 'https://res.cloudinary.com/your-cloud-name/image/upload/w_400,h_300,c_fill/fruits/apple.jpg';
      } else if (type === 'vegetable') {
        return 'https://res.cloudinary.com/dsad92ak9/image/upload/zufzlfeozy7tzcdpwj8i';
      } else {
        return 'https://via.placeholder.com/150?text=Product+Image';
      }
    },
  },
}, { timestamps: true });

const productModel = mongoose.models.product || mongoose.model('product', productSchema);

export default productModel;
