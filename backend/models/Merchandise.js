import mongoose from 'mongoose';

const merchandiseSchema = new mongoose.Schema({
  product_name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: 150
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    maxlength: 50
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: 0
  },
  stock: {
    type: Number,
    default: 0,
    min: 0
  },
  image: {
    type: String,
    default: null,
    maxlength: 255
  },
  status: {
    type: String,
    enum: ['Available', 'Out of Stock'],
    default: 'Available'
  }
});

export default mongoose.models.Merchandise || mongoose.model('Merchandise', merchandiseSchema);
