import messageModel from './models/messages.model.js';


export default class Message {
  get = async () => {
    return messageModel.find().sort({ $natural: 1 })
  };
  create = async (message) => {
    return messageModel.create(message);
  };
}

