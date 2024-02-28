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
    <div>
      <h1> 🥳¡¡Gracias por tu compra!! 🥳</h1>
      <h3>El monto total de su compra es: ${ticket.amount}</h3>
      <h3>Método Utilizado: ${method}</h3> 
      <p>En la fecha: ${ticket.purchase_datetime}</p> 
      <ul>
      `;

    // Agregar una tarjeta para cada producto
    products.forEach((product) => {
      html += `
        <li>
            <div>
                <h4>${product.product.title}</h4> 
                <p>Precio: ${product.product.price}$</p> 
                <p>Cantidad: ${product.quantity}</p> 
            </div>
        </li>
    `;
    });

    html += `
     </ul>
     <a href="${config.baseUrl}/api/payments/success/${ticket._id}" >Ver compra</a>
    <h2>Gracias por confiar en nosotros</h2>
    </div>
    `;

    const user = {
      email: ticket.purchaser,
    };

    const result = this.mail.send(user, 'Gracias por tu compra', html);
    return result;
  };
}
