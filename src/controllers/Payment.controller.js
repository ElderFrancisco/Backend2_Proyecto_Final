import {
  CartService,
  UserService,
  ProductService,
  TicketService,
} from '../repository/index.js';
import StripePaymentService from '../services/stripe.service.js';
import MercadoPagoPaymentService from '../services/mercadopago.service.js';
import mongoose from 'mongoose';

const MercadoPago = new MercadoPagoPaymentService();
const StripeService = new StripePaymentService();

export const purchaseCartByIdStripe = async (req, res) => {
  try {
    const cid = req.params.cid;
    if (!isValidMongoId(cid)) {
      return res
        .status(400)
        .json({ status: 'error', error: 'Invalid Cart ID' });
    }
    const cart = await CartService.getByID(cid);
    if (!cart) {
      req.logger.info('Cart not found');
      return res.status(404).json({ status: 'error', error: 'Cart Not Found' });
    }
    const user = await UserService.getByCartID(cid);
    if (!user) {
      return res.status(404).json({
        status: 'error',
        error: 'Cart Not Found or does not have a user',
      });
    }

    const productsArray = cart.products;
    if (!productsArray.length) {
      return res.status(404).json({ status: 'error', error: 'Cart Empty' });
    }

    const proceso = await procesarProductos(productsArray);

    if (proceso.successful_products.length <= 0) {
      return res
        .status(404)
        .json({ status: 'error', error: 'products out of stock' });
    }

    const successfulProductsFiletered = proceso.successful_products.map(
      (p) => ({
        product: p.product._id,
        quantity: p.quantity,
      }),
    );

    if (proceso.failed_products.length > 0) {
      const productosFallidos = productsArray
        .filter((p) => proceso.failed_products.includes(p.product._id))
        .map((p) => ({
          product: p.product._id,
          quantity: p.quantity,
        }));
      cart.products = productosFallidos;
    } else {
      cart.products = [];
    }

    await CartService.update(cart);
    const codigoAleatorio = Math.random().toString(36).substring(2, 22);

    let ticket = {
      createdAt: new Date(),
      code: codigoAleatorio,
      amount: proceso.total_price,
      purchaser: user.email,
      products: successfulProductsFiletered,
      cartId: cart._id,
      status: 'pending',
    };

    const ticketCreated = await TicketService.create(ticket);
    if (!ticketCreated) {
      return res
        .status(500)
        .json({ status: 'error', error: 'Error creating ticket' });
    }

    const checkout = await StripeService.createCheckout(
      proceso.successful_products,
      ticketCreated._id,
    );

    ticket = {
      _id: ticketCreated._id,
      amount: checkout.amount_total,
      stripePaymentId: checkout.id,
    };

    await TicketService.update(ticket);

    return res.status(201).json({ status: 'Success', payload: checkout });
  } catch (error) {
    req.logger.error(`Error en purchaseCartByIdStripe: ${error}`);
    return res.status(500).json({ status: 'error' });
  }
};

export const purchaseCartByIdMercadopago = async (req, res) => {
  try {
    const cid = req.params.cid;
    if (!isValidMongoId(cid)) {
      return res
        .status(400)
        .json({ status: 'error', error: 'Invalid Cart ID' });
    }
    const cart = await CartService.getByID(cid);
    if (!cart) {
      req.logger.info('Cart not found');
      return res.status(404).json({ status: 'error', error: 'Cart Not Found' });
    }
    const user = await UserService.getByCartID(cid);
    if (!user) {
      return res.status(404).json({
        status: 'error',
        error: 'Cart Not Found or does not have a user',
      });
    }

    const productsArray = cart.products;
    if (!productsArray.length) {
      return res.status(404).json({ status: 'error', error: 'Cart Empty' });
    }

    const proceso = await procesarProductos(productsArray);

    if (proceso.successful_products.length <= 0) {
      return res
        .status(404)
        .json({ status: 'error', error: 'products out of stock' });
    }

    const successfulProductsFiletered = proceso.successful_products.map(
      (p) => ({
        product: p.product._id,
        quantity: p.quantity,
      }),
    );

    if (proceso.failed_products.length > 0) {
      const productosFallidos = productsArray
        .filter((p) => proceso.failed_products.includes(p.product._id))
        .map((p) => ({
          product: p.product._id,
          quantity: p.quantity,
        }));
      cart.products = productosFallidos;
    } else {
      cart.products = [];
    }

    await CartService.update(cart);
    const codigoAleatorio = Math.random().toString(36).substring(2, 22);

    let ticket = {
      createdAt: new Date(),
      code: codigoAleatorio,
      amount: proceso.total_price,
      purchaser: user.email,
      products: successfulProductsFiletered,
      cartId: cart._id,
      status: 'pending',
    };

    const ticketCreated = await TicketService.create(ticket);
    if (!ticketCreated) {
      return res
        .status(500)
        .json({ status: 'error', error: 'Error creating ticket' });
    }
    const checkout = await MercadoPago.createOrder(
      proceso.successful_products,
      ticketCreated._id,
    );

    ticket = {
      _id: ticketCreated._id,
      amount: checkout.amount_total,
      stripePaymentId: checkout.id,
    };

    await TicketService.update(ticket);

    return res.status(201).json({ status: 'Success', payload: checkout });
  } catch (error) {
    req.logger.error(`Error en purchaseCartByIdMercadopago: ${error}`);
    console.log(error);
    return res.status(500).json({ status: 'error' });
  }
};

export const successPayment = async (req, res) => {
  try {
    const tid = req.params.tid;

    const ticket = await TicketService.getById(tid);
    if (!ticket) {
      return res
        .status(404)
        .json({ status: 'error', error: 'Ticket Not Found' });
    }
    if (ticket.status === 'pending') {
      ticket.status = 'paid';
      ticket.purchase_datetime = new Date();
      TicketService.sendEmail(ticket);
      await TicketService.update(ticket);
    }

    if (ticket.stripePaymentId) {
      ticket.method = 'Stripe';
    } else {
      ticket.method = 'Mercado Pago';
    }

    return res.status(200).render('paymentSuccess', { ticket, user: req.user });
  } catch (error) {
    req.logger.error(`Error en successPayment: ${error}`);
    return res.status(500).json({ status: 'error' });
  }
};

export const failurePayment = async (req, res) => {
  try {
    return res.status(200).render('paymentFailure', { user: req.user });
  } catch (error) {
    req.logger.error(`Error en failurePayment: ${error}`);
    return res.status(500).json({ status: 'error' });
  }
};

function isValidMongoId(id) {
  return mongoose.Types.ObjectId.isValid(id);
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
