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
}
