import CartServices from "../services/cart.services.js";
import { CartService, ProductService } from "../repository/index.js";
import mongoose from "mongoose";

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
  const index = currentPath.indexOf("?");
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
          // Si el producto ya está en el mapa, agregar la cantidad
          productMap.set(productId, productMap.get(productId) + quantity);
        } else {
          // Si es la primera vez que se encuentra el producto, agregarlo al mapa
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
      req.logger.info("Cart not found");
      return res.status(404).json({ status: "error", error: "Cart Not Found" });
    }
    return res.status(201).json(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: "error" });
  }
};

export const getCartById = async (req, res) => {
  try {
    const cid = req.params.cid;
    if (!isValidMongoId(cid)) {
      return res
        .status(400)
        .json({ status: "error", error: "Invalid Cart ID" });
    }
    const result = await CartService.getByID(cid);
    if (!result) {
      req.logger.info("Cart not found");
      return res.status(404).json({ status: "error", error: "Cart Not Found" });
    }
    return res.status(200).json({ status: "Success", payload: result });
  } catch (error) {
    req.logger.error(error);
    return null;
  }
};

export const getCarts = async (req, res) => {
  try {
    console.log("a");
    const pathUrl = getPathUrl(req);
    const params = getQueryParams(req);
    const result = await CartServicesManager.getCarts(params, pathUrl);
    return res.status(200).json(result);
  } catch (error) {
    req.logger.error(error);
    return res.status(500).json({ status: "error" });
  }
};

export const updateOneCartByIdProduct = async (req, res) => {
  try {
    const cid = req.params.cid;
    if (!isValidMongoId(cid)) {
      return res
        .status(400)
        .json({ status: "error", error: "Invalid Cart ID" });
    }
    const pid = req.params.pid;
    if (!isValidMongoId(pid)) {
      return res
        .status(400)
        .json({ status: "error", error: "Invalid Product ID" });
    }
    const product = await ProductService.getByID(pid);

    if (!product) {
      return res
        .status(404)
        .json({ status: "error", error: "Product Not Found" });
    }

    if (req.user.user.email === product.owner) {
      return res
        .status(401)
        .json({ status: "error", error: "Cant add yourself product" });
    }
    const result = await CartServicesManager.updateOneCart(cid, pid);
    if (!result) {
      req.logger.info("Cart not found");
      return res.status(404).json({ status: "error", error: "Cart Not Found" });
    }
    return res.status(201).json({ status: "Success", payload: result });
  } catch (error) {
    req.logger.error(error);
    return res.status(500).json({ status: "error" });
  }
};

export const deleteProductById = async (req, res) => {
  try {
    const cid = req.params.cid;
    if (!isValidMongoId(cid)) {
      return res
        .status(400)
        .json({ status: "error", error: "Invalid Cart ID" });
    }
    const pid = req.params.pid;
    if (!isValidMongoId(pid)) {
      return res
        .status(400)
        .json({ status: "error", error: "Invalid Product ID" });
    }
    const result = await CartServicesManager.deleteProductCart(cid, pid);
    if (!result) {
      req.logger.info("Cart not found");
      return res.status(404).json({ status: "error", error: "Cart Not Found" });
    }
    return res.status(201).json({ status: "Success", payload: result });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: "error" });
  }
};

export const updateManyProducts = async (req, res) => {
  try {
    const cid = req.params.cid;
    if (!isValidMongoId(cid)) {
      return res
        .status(400)
        .json({ status: "error", error: "Invalid Cart ID" });
    }
    const productsBody = Array.isArray(req.body.products)
      ? req.body.products
      : [];
    const productMap = new Map();
    productsBody.forEach((product) => {
      if (product.product && product.quantity) {
        const { product: productId, quantity } = product;
        if (productMap.has(productId)) {
          // Si el producto ya está en el mapa, agregar la cantidad
          productMap.set(productId, productMap.get(productId) + quantity);
        } else {
          // Si es la primera vez que se encuentra el producto, agregarlo al mapa
          productMap.set(productId, quantity);
        }
      }
    });
    const products = [...productMap].map(([product, quantity]) => ({
      product,
      quantity,
    }));

    const result = await CartServicesManager.updateManyProducts(cid, products);
    if (!result) {
      req.logger.info("Cart not found");
      return res.status(404).json({ status: "error", error: "Cart Not Found" });
    }
    return res.status(201).json({ status: "Success", payload: result });
  } catch (error) {
    req.logger.error(error);
    return res.status(500).json({ status: "error" });
  }
};
export const emptyCartById = async (req, res) => {
  try {
    const cid = req.params.cid;
    if (!isValidMongoId(cid)) {
      return res
        .status(400)
        .json({ status: "error", error: "Invalid Cart ID" });
    }
    const result = await CartService.emptyByID(cid);
    if (!result) {
      req.logger.info("Cart not found");
      return res.status(404).json({ status: "error", error: "Cart Not Found" });
    }
    return res.status(201).json({ status: "Success", payload: result });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: "error" });
  }
};
export const renderGetCartById = async (req, res) => {
  try {
    const cid = req.params.cid;
    if (!isValidMongoId(cid)) {
      return res
        .status(400)
        .json({ status: "error", error: "Invalid Cart ID" });
    }

    const result = await CartService.getByID(cid);

    if (!result) {
      return res.status(404).json({ status: "error", error: "Cart Not Found" });
    }
    return res
      .status(200)
      .render("cartView", { cart: result, user: req.user.user });
  } catch (error) {
    console.log(error);
    return null;
  }
};
export const purchaseCartById = async (req, res) => {
  try {
    const cid = req.params.cid;
    if (!isValidMongoId(cid)) {
      return res
        .status(400)
        .json({ status: "error", error: "Invalid Cart ID" });
    }
    const result = await CartService.createTicket(cid);
    if (result == null)
      return res.status(404).json({
        status: "Error",
        message: "Usuario No encontrado o carrito vacio",
      });

    return res.status(201).json({ status: "Success", payload: result });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: "error" });
  }
};

function isValidMongoId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}
