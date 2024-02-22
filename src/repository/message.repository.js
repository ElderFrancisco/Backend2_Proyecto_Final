import MessageCreateDTO from '../DTO/message.dto.js';

export default class TicketRepository {
  constructor(dao) {
    this.dao = dao;
  }

  create = async (data) => {
    const dataToInsert = new MessageCreateDTO(data);
    return this.dao.create(dataToInsert);
  };
  
  get = async () => {
    return this.dao.get();
  };
  
}
