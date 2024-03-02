import cartModel from './models/carts.model.js';
export default class Cart {
  get = async () => {
    return cartModel.find();
  };
  create = async (data) => {
    return cartModel.create(data);
  };
  getByID = async (id) => {
    return cartModel.findById(id).populate('products.product').lean();
  };
  update = async (data) => {
    return cartModel.findOneAndUpdate({ _id: data._id }, data, { new: true });
  };
  paginate = async (params) => {
    return cartModel.paginate(params.query, {
      limit: params.limit,
      page: params.page,
      sort: params.sort,
      lean: true,
    });
  };
  deleteByID = async (id) => {
    return cartModel.deleteOne({ _id: id });
  };
  getManyByQuery = async (query) => {
    return cartModel.find(query);
  };
}
