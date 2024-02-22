import mongoose from 'mongoose';

const userCollection = 'users';

const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: {
    type: String,
    unique: true,
  },
  age: Number,
  password: String,
  rol: {
    type: String,
    default: 'user',
  },
  cartId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'carts',
    required: true,
  },
});

const userModel = mongoose.model(userCollection, userSchema);

export default userModel;
