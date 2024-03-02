import CartCreateDTO from '../DTO/carts.dto.js';

import { ProductService } from './index.js';

export default class CartRepository {
  constructor(dao) {
    this.dao = dao;
  }

  paginate = async (params) => {
    return this.dao.paginate(params);
  };
  get = async () => {
    return this.dao.get();
  };
  getByID = async (id) => {
    return this.dao.getByID(id);
  };
  create = async (data) => {
    const dataToInsert = new CartCreateDTO(data);
    return this.dao.create(dataToInsert);
  };
  update = async (data) => {
    const dataToInsert = new CartCreateDTO(data);
    return this.dao.update(dataToInsert);
  };
  deleteByID = async (id) => {
    return this.dao.deleteByID(id);
  };
  emptyByID = async (id) => {
    const cart = {
      _id: id,
      products: [],
    };
    return this.dao.update(cart);
  };
  deleteOneProductOnManyCarts = async (id) => {
    const carritosConProducto = await this.dao.getManyByQuery({
      'products.product': id,
    });
    console.log(carritosConProducto);
    for (const carrito of carritosConProducto) {
      // Filtrar la lista de productos del carrito para eliminar el producto específico
      carrito.products = carrito.products.filter(
        (item) => String(item.product) !== id,
      );

      // Guardar los cambios en el carrito
      await carrito.save();
    }

    // Puedes retornar los carritos actualizados si es necesario
    return carritosConProducto;
  };
}
async function procesarProductos(productsArray) {
  const successfulProducts = [];
  const productsNotProcessed = [];
  let precioTotal = 0;
  for (const p of productsArray) {
    try {
      if (p.product.stock >= p.quantity) {
        const newStock = p.product.stock - p.quantity;
        const body = { stock: newStock };
        body['_id'] = p.product._id;

        await ProductService.update(body);
        const sumaTotalDeProducto = p.quantity * p.product.price;
        precioTotal += sumaTotalDeProducto;
        successfulProducts.push(p); // Agregar productos comprados con éxito
      } else {
        productsNotProcessed.push(p.product._id);
      }

      // Tu lógica con el producto obtenido de la base de datos
    } catch (error) {}
  }
  return {
    total_price: precioTotal,
    successful_products: successfulProducts,
    failed_products: productsNotProcessed,
  };
}
