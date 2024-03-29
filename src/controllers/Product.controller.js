import { getProductsServices } from '../services/product.services.js';
import { ProductService } from '../repository/index.js';
import mongoose from 'mongoose';
import { Admin } from 'mongodb';

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

    if (req.user.rol == 'premium' || req.user.rol == 'admin') {
      req.body.owner = req.user.email;
    }
    if (req.body.price < 1) {
      return res
        .status(400)
        .json({ status: 'error', error: 'minimun price is $1' });
    }

    const productCode = await ProductService.getByQuery({
      code: req.body.code,
    });
    if (productCode) {
      return res
        .status(409)
        .json({ status: 'error', error: 'Code Already exists' });
    }
    const pathWithoutSrc = req.file.path.replace(
      /^.*src[\/\\]public[\/\\]/,
      '\\',
    );

    req.body.thumbnail = [pathWithoutSrc];

    const NewProduct = await ProductService.create(req.body);

    return res.status(201).json({ status: 'success', payload: NewProduct });
  } catch (error) {
    req.logger.error('error addProduct :', error);
    return res.status(500).json({ status: 'error' });
  }
};

export const getProductById = async (req, res) => {
  try {
    const Id = req.params.pid;
    if (!isValidMongoId(Id)) {
      return res
        .status(400)
        .json({ status: 'error', error: 'Invalid Product ID' });
    }
    const productId = await ProductService.getByID(Id);
    if (productId == null) {
      return res.status(404).json({ status: 'error', error: 'Not found' });
    }
    return res.status(200).json({ status: 'success', payload: productId });
  } catch (error) {
    req.logger.error('error getProductById :', error);
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
        .status(405)
        .json({ status: 'error', error: 'Product Not Found' });
    }

    if (productToUpdate.owner !== req.user.email && req.user.rol !== 'admin') {
      return res.status(403).json({
        status: 'error',
        error: 'This is not your product or you are not admin',
      });
    }
    const productCode = await ProductService.getByQuery({
      code: req.body.code,
    });
    if (productCode && body.code !== productToUpdate.code) {
      return res
        .status(409)
        .json({ status: 'error', error: 'Code Already exists' });
    }
    body['_id'] = Id;

    const result = await ProductService.update(body);
    return res.status(200).json({ status: 'success', payload: result });
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

    if (!productToDelete) {
      req.logger.info('Product not found');
      return res.status(404).json({ status: 'error', error: 'Not Found' });
    }
    if (productToDelete.owner != req.user.email && req.user.rol != 'admin') {
      return res.status(403).json({
        status: 'error',
        error: 'This is not your product or you are not admin',
      });
    }

    const productDelete = await ProductService.deleteByID(Id, productToDelete);
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
    req.logger.error('error on deleteProductById: ' + error);
    return res.status(500).json({ status: 'error' });
  }
};

export const renderGetProducts = async (req, res) => {
  try {
    const pathUrl = getPathUrl(req);
    const params = getQueryParams(req);
    if (params.query == null) {
      params.query = { status: true };
    }
    const user = req.user;

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
    const user = req.user;

    const Id = req.params.pid;
    if (!isValidMongoId(Id)) {
      return res
        .status(400)
        .json({ status: 'error', error: 'Invalid Product ID' });
    }
    const product = await ProductService.getByID(Id);
    if (product == null) {
      return res.status(404).redirect('/products');
    }
    return res
      .status(200)
      .render('productView', { product: product, user: user });
  } catch (error) {
    req.logger.error('renderGetProductById: ' + error);
    return res.status(500).json({ status: 'error' });
  }
};

export const renderAddProduct = async (req, res) => {
  try {
    const user = req.user;
    return res.status(200).render('addProduct', { user: user });
  } catch (error) {
    req.logger.error('renderAddProduct: ' + error);
    return res.status(500).json({ status: 'error' });
  }
};

export const renderOwnerProducts = async (req, res) => {
  try {
    const user = req.user;
    let productList;

    if (user.rol === 'admin') {
      productList = await ProductService.getManyByQuery({});
    } else {
      productList = await ProductService.getManyByQuery({
        owner: user.email,
      });
    }

    return res
      .status(200)
      .render('ownerProducts', { user: user, products: productList });
  } catch (error) {
    req.logger.error('renderAddProduct: ' + error);
    return res.status(500).json({ status: 'error' });
  }
};

export const renderOwnerProductModify = async (req, res) => {
  try {
    const user = req.user;

    const product = await ProductService.getByID(req.params.pid);
    if (product == null) {
      return res.status(404).redirect('/404');
    }
    if (product.owner !== user.email && user.rol !== 'admin') {
      return res.status(403).redirect('/products');
    }
    return res
      .status(200)
      .render('modifyProduct', { user: user, product: product });
  } catch (error) {
    req.logger.error('renderAddProduct: ' + error);
    return res.status(500).json({ status: 'error' });
  }
};

function isValidMongoId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}
