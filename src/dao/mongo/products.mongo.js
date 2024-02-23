import productModel from './models/products.model.js';

export default class Product {
  get = async () => {
    return productModel.find();
  };
  create = async (data) => {
    return productModel.create(data);
  };
  getByID = async (id) => {
    return productModel.findById(id).lean();
  };
  getByQuery = async (query) => {
    return productModel.findOne(query);
  };
  update = async (data) => {
    return productModel.findOneAndUpdate({ _id: data._id }, data, {
      new: true,
    });
  };
  paginate = async (params) => {
    return productModel.paginate(params.query, {
      limit: params.limit,
      page: params.page,
      sort: params.sort,
      lean: true,
    });
  };
  deleteByID = async (id) => {
    return productModel.deleteOne({ _id: id });
  };
}
