export default class CartCreateDTO {
  constructor(cart) {
    this._id = cart?._id;
    this.products = cart?.products || [];
  }
}
