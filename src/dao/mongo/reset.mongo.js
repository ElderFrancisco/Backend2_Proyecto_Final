import resetModel from './models/reset.model.js';

export default class Message {
  getByQuery = async (query) => {
    return resetModel.findOne(query);
  };
  create = async (data) => {
    return resetModel.create(data);
  };
  delete = async (id) => {
    return resetModel.deleteOne({ _id: id });
  };
}
