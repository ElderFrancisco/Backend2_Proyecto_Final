import Stripe from 'stripe';
import config from '../config/config.js';

export default class PaymentService {
  constructor() {
    this.stripe = new Stripe(config.stripeKey);
  }
  createPaymentIntent = async (data) => {
    const paymentIntent = this.stripe.paymentIntents.create(data);
    return paymentIntent;
  };

  createCheckout = async (productList, ticketId) => {
    const line_items = productList.map((product) => {
      return {
        price_data: {
          product_data: {
            name: product.product.title,
            description: product.product.description,
          },
          currency: 'usd',
          unit_amount: product.product.price,
        },
        quantity: product.quantity,
      };
    });

    const session = await this.stripe.checkout.sessions.create({
      line_items: line_items,
      mode: 'payment',
      success_url: `http://localhost:8080/api/payments/success/${ticketId}`,
      cancel_url: 'http://localhost:8080/api/payments/cancel',
    });
    return session;
  };

  // retrievePaymentIntent = async (id) => {
  //   const paymentIntent = await this.stripe.(id);
  //   console.log(paymentIntent);
  //   return paymentIntent;
  // };
}
