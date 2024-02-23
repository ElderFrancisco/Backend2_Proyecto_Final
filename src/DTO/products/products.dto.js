export default class ProductCreateDTO {
  constructor(product) {
    this._id = product?._id;
    this.title = product?.title;
    this.description = product?.description;
    this.price = product?.price;
    this.status = product?.status;
    this.code = product?.code;
    this.stock = product?.stock;
    this.category = product?.category;
    this.thumbnail = product?.thumbnail;
    this.owner = product?.owner;
  }
}
