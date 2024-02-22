import ProductCreateDTO from '../DTO/products/products.dto.js';
import ProductUpdateDTO from '../DTO/products/productsUpdate.dto.js';

export default class ProductRepository {
  constructor(dao) {
    this.dao = dao;
  }

  paginate = async (params) => {
    return this.dao.paginate(params);
  };
  get = async () => {
    return this.dao.get();
  };
  getByID = async (id) => {
    return this.dao.getByID(id);
  };
  create = async (data) => {
    const dataToInsert = new ProductCreateDTO(data);
    return this.dao.create(dataToInsert);
  };
  update = async (data) => {
    const dataToInsert = new ProductUpdateDTO(data);
    return this.dao.update(dataToInsert);
  };
  deleteByID = async (id) => {
    return this.dao.deleteByID(id);
  };

  //   addTicket = async (userID, ticketID) => {
  //     const user = await this.dao.getByID(userID);

  //     if (!user) {
  //       throw new Error(`User not found`);
  //     }
  //     const ticket = await TicketService.getByID(ticketID);
  //     if (!ticket) {
  //       throw new Error(`Ticket not found`);
  //     }

  //     user.tickets.push(ticketID);

  //     return this.dao.update(user);
  //   };

  //   reminder = async (userID) => {
  //     const user = await this.dao.getByID(userID);

  //     let html = `Mr ${user.name}, your tickets: <hr><ul>`;
  //     for (let i = 0; i < user.tickets.length; i++) {
  //       const ticketID = user.tickets[i];
  //       const ticket = await TicketService.getByID(ticketID);

  //       html = html.concat(`<li>${ticket.name}: ${ticket.description}<li>`);
  //     }
  //     html += `<ul>`;

  //     const result = this.mail.send(user, 'Reminder Tickets', html);

  //     return result;
  //   };
}
