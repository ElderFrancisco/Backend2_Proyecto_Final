import mongoose from 'mongoose';

const ResetCollection = 'reset';

const resetSchema = new mongoose.Schema({
  dateEnd: {
    type: Date,
    required: true,
  },
  UserId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'users',
    required: true,
  },
  Code: {
    type: String,
    required: true,
    unique: true,
  },
});

const resetModel = mongoose.model(ResetCollection, resetSchema);
export default resetModel;
