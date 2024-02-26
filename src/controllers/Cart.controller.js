import CartServices from '../services/cart.services.js';
import { CartService, ProductService } from '../repository/index.js';
import mongoose from 'mongoose';

const CartServicesManager = new CartServices();

function getQueryParams(req) {
  const p = req.query;
  const limit = parseInt(p.limit) || 10;
  const page = p.page || 1;
  const params = {
    limit,
    page,
  };
  return params;
}
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

export const createNewCart = async (req, res) => {
  try {
    const productsBody = Array.isArray(req.body.products)
      ? req.body.products
      : [];
    const productMap = new Map();
    productsBody.forEach((product) => {
      if (product.product && product.quantity) {
        const { product: productId, quantity } = product;
        if (productMap.has(productId)) {
          productMap.set(productId, productMap.get(productId) + quantity);
        } else {
          productMap.set(productId, quantity);
        }
      }
    });
    const products = [...productMap].map(([product, quantity]) => ({
      product,
      quantity,
    }));

    const cart = {
      products,
    };

    const result = await CartService.create(cart);
    if (!result) {
      req.logger.info('Cart not found');
      return res.status(404).json({ status: 'error', error: 'Cart Not Found' });
    }
    return res.status(201).json(result);
  } catch (error) {
    req.logger.error(`Error en createNewCart:  ${error}`);
    return res.status(500).json({ status: 'error' });
  }
};

export const getCartById = async (req, res) => {
  try {
    const cid = req.params.cid;
    if (!isValidMongoId(cid)) {
      return res
        .status(400)
        .json({ status: 'error', error: 'Invalid Cart ID' });
    }
    const result = await CartService.getByID(cid);
    if (!result) {
      req.logger.info('Cart not found');
      return res.status(404).json({ status: 'error', error: 'Cart Not Found' });
    }
    return res.status(200).json({ status: 'Success', payload: result });
  } catch (error) {
    req.logger.error(`Error en getCarts ${error}`);
    return res.status(500).json({ status: 'error' });
  }
};

export const getCarts = async (req, res) => {
  try {
    const pathUrl = getPathUrl(req);
    const params = getQueryParams(req);
    const result = await CartServicesManager.getCarts(params, pathUrl);
    return res.status(200).json(result);
  } catch (error) {
    req.logger.error(`Error en getCartById ${error}`);
    return res.status(500).json({ status: 'error' });
  }
};

export const updateOneCartByIdProduct = async (req, res) => {
  try {
    const cid = req.params.cid;
    if (!isValidMongoId(cid)) {
      return res
        .status(400)
        .json({ status: 'error', error: 'Invalid Cart ID' });
    }
    const pid = req.params.pid;
    if (!isValidMongoId(pid)) {
      return res
        .status(400)
        .json({ status: 'error', error: 'Invalid Product ID' });
    }
    const product = await ProductService.getByID(pid);

    if (!product) {
      return res
        .status(404)
        .json({ status: 'error', error: 'Product Not Found' });
    }

    if (req.user.email === product.owner) {
      return res
        .status(401)
        .json({ status: 'error', error: 'Cant add yourself product' });
    }
    const result = await CartServicesManager.updateOneCart(cid, pid);
    if (!result) {
      req.logger.info('Cart not found');
      return res.status(404).json({ status: 'error', error: 'Cart Not Found' });
    }
    return res.status(201).json({ status: 'Success', payload: result });
  } catch (error) {
    req.logger.error(`Error en updateOneCartByIdProduct ${error}`);
    return res.status(500).json({ status: 'error' });
  }
};

export const deleteProductById = async (req, res) => {
  try {
    const cid = req.params.cid;
    if (!isValidMongoId(cid)) {
      return res
        .status(400)
        .json({ status: 'error', error: 'Invalid Cart ID' });
    }
    const pid = req.params.pid;
    if (!isValidMongoId(pid)) {
      return res
        .status(400)
        .json({ status: 'error', error: 'Invalid Product ID' });
    }
    const cart = await CartService.getByID(cid);
    if (!cart) {
      req.logger.info('Cart not found');
      return res.status(404).json({ status: 'error', error: 'Cart Not Found' });
    }
    const result = await CartServicesManager.deleteProductCart(cid, pid);
    if (!result) {
      req.logger.info('Not product Found in cart');
      return res
        .status(404)
        .json({ status: 'error', error: 'product Not Found in the cart' });
    }
    return res.status(200).json({ status: 'Success', payload: result });
  } catch (error) {
    req.logger.error(`Error en deleteProductById ${error}`);
    return res.status(500).json({ status: 'error' });
  }
};

export const updateManyProducts = async (req, res) => {
  try {
    const cid = req.params.cid;
    if (!isValidMongoId(cid)) {
      return res
        .status(400)
        .json({ status: 'error', error: 'Invalid Cart ID' });
    }
    const productsBody = Array.isArray(req.body.products)
      ? req.body.products
      : [];
    const productMap = new Map();
    async function procesarProductos(productsBody, req, productMap) {
      for (const product of productsBody) {
        if (product.product && product.quantity) {
          const ownerProduct = await ProductService.getByID(product.product);
          if (req.user.email === ownerProduct.owner) {
            return;
          }
          const { product: productId, quantity } = product;
          if (productMap.has(productId)) {
            productMap.set(productId, productMap.get(productId) + quantity);
          } else {
            productMap.set(productId, quantity);
          }
        }
      }
    }
    await procesarProductos(productsBody, req, productMap);
    const products = [...productMap].map(([product, quantity]) => ({
      product,
      quantity,
    }));

    const result = await CartServicesManager.updateManyProducts(cid, products);
    if (!result) {
      req.logger.info('Cart not found');
      return res.status(404).json({ status: 'error', error: 'Cart Not Found' });
    }
    return res.status(201).json({ status: 'Success', payload: result });
  } catch (error) {
    req.logger.error(`Error en updateManyProducts ${error}`);
    return res.status(500).json({ status: 'error' });
  }
};
export const emptyCartById = async (req, res) => {
  try {
    const cid = req.params.cid;
    if (!isValidMongoId(cid)) {
      return res
        .status(400)
        .json({ status: 'error', error: 'Invalid Cart ID' });
    }
    const result = await CartService.emptyByID(cid);
    if (!result) {
      req.logger.info('Cart not found');
      return res.status(404).json({ status: 'error', error: 'Cart Not Found' });
    }
    return res.status(200).json({ status: 'Success', payload: result });
  } catch (error) {
    req.logger.error(`Error en emptyCartById ${error}`);
    return res.status(500).json({ status: 'error' });
  }
};
export const renderGetCartById = async (req, res) => {
  try {
    const cid = req.params.cid;
    if (!isValidMongoId(cid)) {
      return res
        .status(400)
        .json({ status: 'error', error: 'Invalid Cart ID' });
    }

    const result = await CartService.getByID(cid);

    if (!result) {
      return res.status(404).json({ status: 'error', error: 'Cart Not Found' });
    }
    return res.status(200).render('cartView', { cart: result, user: req.user });
  } catch (error) {
    req.logger.error(`Error en renderGetCartById ${error}`);
    return res.status(500).json({ status: 'error' });
  }
};
export const purchaseCartById = async (req, res) => {
  try {
    const cid = req.params.cid;
    if (!isValidMongoId(cid)) {
      return res
        .status(400)
        .json({ status: 'error', error: 'Invalid Cart ID' });
    }
    const result = await CartService.createTicket(cid);

    switch (result.code) {
      case 1:
        return res.status(404).json({
          status: 'error',
          error: 'Cart Not Found or does not have a user',
        });
      case 2:
        return res.status(404).json({ status: 'error', error: 'Cart Empty' });
      case 3:
        return res
          .status(404)
          .json({ status: 'error', error: 'products out of stock' });
      default:
        return res.status(201).json({ status: 'Success', payload: result });
    }
  } catch (error) {
    req.logger.error(`Error en purchaseCartById ${error}`);
    return res.status(500).json({ status: 'error' });
  }
};

function isValidMongoId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}
