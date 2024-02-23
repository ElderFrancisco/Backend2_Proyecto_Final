import { getProductsServices } from '../services/product.services.js';
import { ProductService } from '../repository/index.js';
import mongoose from 'mongoose';

function getPathUrl(req) {
  const currentPath = req.originalUrl;
  const index = currentPath.indexOf('?');
  if (index !== -1) {
    const a = currentPath.substring(0, index);
    return a;
  } else {
    return currentPath;
  }
}

function getQueryParams(req) {
  const p = req.query;
  const limit = parseInt(p.limit) || 10;
  const page = p.page || 1;
  const pquery = p.query;
  const psort = p.sort;
  const query = (() => {
    try {
      return JSON.parse(pquery);
    } catch (error) {
      return null;
    }
  })();

  const sort = (() => {
    try {
      return JSON.parse(psort);
    } catch (error) {
      return null;
    }
  })();
  const params = {
    limit,
    page,
    query,
    sort,
  };
  return params;
}

export const getProducts = async (req, res) => {
  try {
    const pathUrl = getPathUrl(req);
    const params = getQueryParams(req);
    const result = await getProductsServices(params, pathUrl);
    return res.status(200).json(result);
  } catch (error) {
    req.logger.error(error);
    return res.status(500).json({ status: 'error' });
  }
};
export const addProduct = async (req, res) => {
  try {
    if (!req.body.title || !req.body.price) {
      return res
        .status(400)
        .json({ status: 'error', error: 'Not sent correct data' });
    }
    if (req.user.user.rol == 'premium') {
      req.body.owner = req.user.user.email;
    }

    const NewProduct = await ProductService.create(req.body);

    return res.status(201).json({ status: 'success', payload: NewProduct });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: 'error' });
  }
};

export const getProductById = async (req, res) => {
  try {
    const Id = req.params.pid;
    if (!isValidMongoId(pid)) {
      return res
        .status(400)
        .json({ status: 'error', error: 'Invalid Product ID' });
    }
    const productId = await ProductService.getByID(Id);
    if (productId == null) {
      req.logger.info('Product not found');
      return res
        .status(404)
        .json({ status: 'error', error: 'Product Not Found' });
    }
    return res.status(200).json({ status: 'success', payload: productId });
  } catch (error) {
    req.logger.error(error);
    return res.status(500).json({ status: 'error' });
  }
};

export const updateProductById = async (req, res) => {
  try {
    const Id = req.params.pid;
    if (!isValidMongoId(Id)) {
      return res
        .status(400)
        .json({ status: 'error', error: 'Invalid Product ID' });
    }
    const body = req.body;
    const productToUpdate = await ProductService.getByID(Id);
    if (!productToUpdate) {
      req.logger.info('Product not found');
      return res
        .status(404)
        .json({ status: 'error', error: 'Product Not Found' });
    }

    //Si el user es owner del product o es admin

    if (
      productToUpdate.owner != req.user.user.email &&
      req.user.user.rol != 'admin'
    ) {
      return res.status(403).json({
        status: 'error',
        error: 'This is not your product or you are not admin',
      });
    }
    body['_id'] = Id;
    const result = await ProductService.update(body);
    return res.status(201).json({ status: 'success', payload: result });
  } catch (error) {
    req.logger.error(error);
    return res.status(500).json({ status: 'error' });
  }
};
export const deleteProductById = async (req, res) => {
  try {
    const Id = req.params.pid;
    if (!isValidMongoId(Id)) {
      return res
        .status(400)
        .json({ status: 'error', error: 'Invalid Product ID' });
    }
    const productToDelete = await ProductService.getByID(Id);
    //Si el user es owner del product o es admin, elimine
    if (
      productToDelete.owner != req.user.user.email &&
      req.user.user.rol != 'admin'
    ) {
      return res.status(403).json({
        status: 'error',
        error: 'This is not your product or you are not admin',
      });
    }

    const productDelete = await ProductService.deleteByID(Id);
    if (productDelete.deletedCount === 1) {
      return res
        .status(204)
        .json({ status: 'Success', message: 'Product deleted successfully' });
    }
    req.logger.info('Product not found');
    return res
      .status(404)
      .json({ status: 'error', error: 'Product Not Found' });
  } catch (error) {
    req.logger.error(error);
    return res.status(500).json({ status: 'error' });
  }
};

export const renderGetProducts = async (req, res) => {
  try {
    const pathUrl = getPathUrl(req);
    const params = getQueryParams(req);
    const { user } = req.user;
    const productList = await getProductsServices(params, pathUrl);
    if (productList.status == 'error') {
      return res.status(500).json({ status: 'error' });
    }
    return res
      .status(200)
      .render('products', { products: productList, user: user });
  } catch (error) {
    req.logger.error(error);
    return res.status(500).json({ status: 'error' });
  }
};

export const renderGetProductById = async (req, res) => {
  try {
    const { user } = req.user;

    const Id = req.params.pid;
    if (!isValidMongoId(Id)) {
      return res
        .status(400)
        .json({ status: 'error', error: 'Invalid Product ID' });
    }
    const product = await ProductService.getByID(Id);
    if (product == null) {
      return res
        .status(404)
        .json({ status: 'error', error: 'product not found' });
    }
    return res
      .status(200)
      .render('productView', { product: product, user: user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: 'error' });
  }
};

function isValidMongoId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}
