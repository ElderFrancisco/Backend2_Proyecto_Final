import TicketCreateDTO from '../DTO/tickets.dto.js';
import config from '../config/config.js';
import Mail from '../util/mail.js';

export default class TicketRepository {
  constructor(dao) {
    this.dao = dao;
    this.mail = new Mail();
  }
  getById = async (id) => {
    return this.dao.getByID(id);
  };

  create = async (data) => {
    const dataToInsert = new TicketCreateDTO(data);
    return this.dao.create(dataToInsert);
  };
  update = async (data) => {
    const dataToInsert = new TicketCreateDTO(data);
    return this.dao.update(dataToInsert);
  };

  sendEmail = async (ticket) => {
    const products = ticket.products;
    let method;
    if (ticket.stripePaymentId) {
      method = 'Stripe';
    } else {
      method = 'Mercado Pago';
    }

    let html = `
    <div style="font-family: Arial, sans-serif; text-align: center;">
        <h1 style="color: #ff8000;"> 🥳¡¡Gracias por tu compra!! 🥳</h1>
        <h3 style="color: #333;">El monto total de su compra es: $${ticket.amount}</h3>
        <h3 style="color: #333;">Método Utilizado: ${method}</h3> 
        <p style="color: #333;">En la fecha: ${ticket.purchase_datetime}</p> 
        <ul style="list-style-type: none; padding: 0; text-align: left;">
`;

    // Agregar una tarjeta para cada producto
    products.forEach((product) => {
      html += `
      <li style="margin-bottom: 20px;">
      <div>
          <h4 style="color: #333;">${product.product.title}</h4> 
          <p style="color: #333;">Precio: ${product.product.price}$</p> 
          <p style="color: #333;">Cantidad: ${product.quantity}</p> 
      </div>
  </li>
    `;
    });

    html += `
    </ul>
    <a href="${config.baseUrl}:${config.port}/api/payments/success/${ticket._id}" style="display: inline-block; background-color: #ff8000; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 5px; margin-top: 20px;">Ver compra</a>
    <h2 style="color: #666; margin-top: 20px;">Gracias por confiar en nosotros</h2>
    </div>
    `;

    const user = {
      email: ticket.purchaser,
    };

    const result = this.mail.send(user, 'Gracias por tu compra', html);
    return result;
  };
}
