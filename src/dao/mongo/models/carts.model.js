import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const cartsCollection = 'carts';

const cartsSchema = new mongoose.Schema({
  products: {
    type: [
      {
        product: {
          type: mongoose.SchemaTypes.ObjectId,
          ref: 'products',
          required: true,
        },
        quantity: Number,
      },
    ],
    default: [],
    _id: false,
  },
});

cartsSchema.plugin(mongoosePaginate);

const cartModel = mongoose.model(cartsCollection, cartsSchema);

export default cartModel;
