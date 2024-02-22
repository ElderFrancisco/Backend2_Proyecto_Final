import CartCreateDTO from '../DTO/carts.dto.js';

import { ProductService, UserService, TicketService } from './index.js';

export default class CartRepository {
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
    const dataToInsert = new CartCreateDTO(data);
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
  createTicket = async (cid) => {
    const user = await UserService.getByCartID(cid);

    if (!user) return null;

    const cartUser = await this.dao.getByID(cid);

    const productsArray = cartUser.products;
    if (!productsArray.length) {
      return null;
    }

    const proceso = await procesarProductos(productsArray);

    if (proceso.failed_products.length > 0) {
      const productosFallidos = productsArray
        .filter((p) => proceso.failed_products.includes(p.product._id))
        .map((p) => ({
          product: p.product._id,
          quantity: p.quantity,
        }));
      cartUser.products = productosFallidos;
    } else {
      cartUser.products = [];
    }
    await this.dao.update(cartUser);

    const codigoAleatorio = Math.random().toString(36).substring(2, 8);
    const ticket = {
      code: codigoAleatorio,
      amount: proceso.total_price,
      purchaser: user.email,
    };
    return TicketService.create(ticket);
  };

  //   export default class Cart {
  //     get = async () => {
  //       return cartModel.find();
  //     };
  //     create = async (data) => {
  //       return cartModel.create(data);
  //     };
  //     getByEmail = async (email) => {
  //       return cartModel
  //         .findOne({ email: email })
  //         .populate('products.product')
  //         .lean();
  //     };
  //     update = async (data) => {
  //       return cartModel.findOneAndUpdate({ _id: data._id }, data, { new: true });
  //     };
  //     paginate = async (params) => {
  //       return cartModel.paginate(
  //         {},
  //         {
  //           limit: params.limit,
  //           page: params.page,
  //           sort: params.sort,
  //           lean: true,
  //         },
  //       );
  //     };
  //     deleteByID = async (id) => {
  //       return cartModel.deleteOne({ _id: id });
  //     };
  //   }

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
async function procesarProductos(productsArray) {
  const productsNotProcessed = [];
  let precioTotal = 0;
  for (const p of productsArray) {
    try {
      if (p.product.stock >= p.quantity) {
        const newStock = p.product.stock - p.quantity;
        const body = { stock: newStock };
        body['_id'] = p.product._id;
        console.log(body);
        await ProductService.update(body);
        const sumaTotalDeProducto = p.quantity * p.product.price;
        precioTotal += sumaTotalDeProducto;
      } else {
        productsNotProcessed.push(p.product._id);
      }

      // Tu lógica con el producto obtenido de la base de datos
    } catch (error) {
      console.log(error);
    }
  }
  return {
    total_price: precioTotal,
    failed_products: productsNotProcessed,
  };
}
