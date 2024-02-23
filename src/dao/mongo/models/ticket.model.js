import mongoose from 'mongoose';

const ticketCollection = 'tickets';

const ticketCollectionSchema = new mongoose.Schema({
  code: {
    type: String,
    unique: true,
    required: true,
  },
  purchase_datetime: {
    type: Date,
    default: Date.now,
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
});

const ticketModel = mongoose.model(ticketCollection, ticketCollectionSchema);

export default ticketModel;
