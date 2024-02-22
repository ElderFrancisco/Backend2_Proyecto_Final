import ticketmodel from './models/ticket.model.js';

export default class Ticket {
  get = async () => {
    return ticketmodel.find();
  };
  create = async (data) => {
    return ticketmodel.create(data);
  };
  getByID = async (id) => {
    return ticketmodel.findById(id);
  };
  update = async (data) => {
    return ticketmodel.updateOne({ _id: data._id }, data);
  };
}
