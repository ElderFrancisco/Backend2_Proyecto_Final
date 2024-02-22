import TicketCreateDTO from '../DTO/tickets.dto.js';

export default class TicketRepository {
  constructor(dao) {
    this.dao = dao;
  }

  create = async (data) => {
    const dataToInsert = new TicketCreateDTO(data);
    return this.dao.create(dataToInsert);
  };
  update = async (data) => {
    const dataToInsert = new CartCreateDTO(data);
    return this.dao.update(dataToInsert);
  };
  deleteByID = async (id) => {
    return this.dao.deleteByID(id);
  };
  emptyByID = async (id) => {
    const cart = {
      _id: id,
      products: [],
    };
    return this.dao.update(cart);
  };
}
