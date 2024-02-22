import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const productsCollection = 'products';

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  code: {
    type: String,
    unique: true,

    default: Math.random().toString(36).substring(2, 8),
  },
  price: {
    type: Number,
    required: true,
  },
  status: {
    type: Boolean,
    default: true,
  },
  stock: {
    type: Number,
    default: 0,
  },
  category: {
    type: String,
    default: '',
  },
  thumbnail: {
    type: Array,
    default: [],
  },
  owner: {
    type: String,
    default: 'admin',
  },
});

productSchema.plugin(mongoosePaginate);

const productModel = mongoose.model(productsCollection, productSchema);

export default productModel;
