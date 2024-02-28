import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';
import config from '../config/config.js';

export default class PaymentService {
  constructor() {
    this.client = new MercadoPagoConfig({ accessToken: config.mercadopagoSk });
    this.Preference = new Preference(this.client);
    this.payment = new Payment(this.client);
  }
  createOrder = async (productList, ticketId) => {
    const items = productList.map((product) => {
      return {
        title: product.product.title,
        description: product.product.description,
        unit_price: product.product.price,
        currency_id: 'ARS',
        quantity: product.quantity,
      };
    });

    const result = await this.Preference.create({
      body: {
        items: items,
        back_urls: {
          success: `http://localhost:8080/api/payments/success/${ticketId}`,
          failure: 'http://localhost:8080/api/payments/failure',
          pending: 'http://localhost:8080/api/payments/pending',
        },
      },
    });

    return result;
  };

  // retrievePaymentIntent = async (id) => {
  //   const paymentIntent = await this.stripe.(id);
  //   console.log(paymentIntent);
  //   return paymentIntent;
  // };
}
