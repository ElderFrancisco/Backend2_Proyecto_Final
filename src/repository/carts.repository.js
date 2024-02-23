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

    if (!user) return { code: 1 };

    const cartUser = await this.dao.getByID(cid);

    const productsArray = cartUser.products;
    if (!productsArray.length) {
      return {
        code: 2,
      };
    }

    const proceso = await procesarProductos(productsArray);

    const successfulProducts = proceso.successful_products.map((p) => ({
      product: p.product._id,
      quantity: p.quantity,
    }));

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

    if (successfulProducts.length <= 0) {
      return {
        code: 3,
      };
    }

    const codigoAleatorio = Math.random().toString(36).substring(2, 22);
    const ticket = {
      code: codigoAleatorio,
      amount: proceso.total_price,
      purchaser: user.email,
      products: successfulProducts, // Agregar array de productos comprados
    };

    return await TicketService.create(ticket);
  };
}
async function procesarProductos(productsArray) {
  const successfulProducts = [];
  const productsNotProcessed = [];
  let precioTotal = 0;
  for (const p of productsArray) {
    try {
      if (p.product.stock >= p.quantity) {
        const newStock = p.product.stock - p.quantity;
        const body = { stock: newStock };
        body['_id'] = p.product._id;

        await ProductService.update(body);
        const sumaTotalDeProducto = p.quantity * p.product.price;
        precioTotal += sumaTotalDeProducto;
        successfulProducts.push(p); // Agregar productos comprados con éxito
      } else {
        productsNotProcessed.push(p.product._id);
      }

      // Tu lógica con el producto obtenido de la base de datos
    } catch (error) {}
  }
  return {
    total_price: precioTotal,
    successful_products: successfulProducts,
    failed_products: productsNotProcessed,
  };
}
