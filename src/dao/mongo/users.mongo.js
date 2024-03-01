import UserModel from './models/users.model.js';

export default class User {
  create = async (data) => {
    return UserModel.create(data);
  };
  getByID = async (id) => {
    return UserModel.findById(id);
  };
  getByQuery = async (query) => {
    return UserModel.findOne(query);
  };
  update = async (data) => {
    return UserModel.updateOne({ _id: data._id }, data, { new: true });
  };
  getAll = async () => {
    return UserModel.find().select('first_name last_name email rol cartId');
  };
  deleteMany = async (query) => {
    return UserModel.deleteMany(query);
  };
}
