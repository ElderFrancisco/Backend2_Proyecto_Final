export default class TicketCreateDTO {
  constructor(ticket) {
    this._id = ticket?._id;
    this.code = ticket?.code;
    this.createdAt = ticket?.createdAt;
    this.purchase_datetime = ticket?.purchase_datetime;
    this.amount = ticket?.amount;
    this.purchaser = ticket?.purchaser;
    this.products = ticket?.products;
    this.mercadoPagoPaymentId = ticket?.mercadoPagoPaymentId;
    this.stripePaymentId = ticket?.stripePaymentId;
    this.cartId = ticket?.cartId;
    this.status = ticket?.status;
  }
}
