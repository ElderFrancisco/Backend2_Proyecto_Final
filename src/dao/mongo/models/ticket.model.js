import mongoose from 'mongoose';

const ticketCollection = 'tickets';

const ticketCollectionSchema = new mongoose.Schema({
  code: {
    type: String,
    unique: true,
    required: true,
  },
  createdAt: {
    type: Date,
  },
  purchase_datetime: {
    type: Date,
  },
  amount: {
    type: Number,
    required: true,
  },
  purchaser: {
    type: String,
    required: true,
  },
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
  },
  mercadoPagoPaymentId: {
    type: String,
  },
  stripePaymentId: {
    type: String,
  },
  cartId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'carts',
    required: true,
  },
  status: {
    type: String,
    default: 'pending',
  },
});

const ticketModel = mongoose.model(ticketCollection, ticketCollectionSchema);

export default ticketModel;
