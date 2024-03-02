import config from '../config/config.js';
import ProductCreateDTO from '../DTO/products/products.dto.js';
import ProductUpdateDTO from '../DTO/products/productsUpdate.dto.js';
import Mail from '../util/mail.js';
import { CartService } from './index.js';

export default class ProductRepository {
  constructor(dao) {
    this.dao = dao;
    this.mail = new Mail();
  }

  paginate = async (params) => {
    return this.dao.paginate(params);
  };
  get = async () => {
    return this.dao.get();
  };
  getByQuery = async (query) => {
    return this.dao.getByQuery(query);
  };
  getByID = async (id) => {
    return this.dao.getByID(id);
  };
  create = async (data) => {
    const dataToInsert = new ProductCreateDTO(data);
    return this.dao.create(dataToInsert);
  };
  update = async (data) => {
    const dataToInsert = new ProductUpdateDTO(data);
    return this.dao.update(dataToInsert);
  };
  deleteByID = async (id, product) => {
    if (product.owner !== 'admin') {
      let html = `<h1 style="color: #333; font-size: 24px; margin-bottom: 20px;">Producto eliminado</h1>
      <p style="color: #666; font-size: 16px; margin-bottom: 20px;">El siguiente producto ha sido eliminado:</p>
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
          <h2 style="color: #333; font-size: 20px; margin-bottom: 10px;">${product.title}</h2>
          <p style="color: #666; font-size: 16px; margin-bottom: 10px;">Descripción: ${product.description}</p>
          <p style="color: #666; font-size: 16px; margin-bottom: 10px;">Código: ${product.code}</p>
          <p style="color: #666; font-size: 16px; margin-bottom: 10px;">Precio: ${product.price}</p>
          <p style="color: #666; font-size: 16px; margin-bottom: 10px;">Categoría: ${product.category}</p>
          <p style="color: #666; font-size: 16px; margin-bottom: 10px;">Propietario: ${product.owner}</p>
      </div>
      <p style="color: #666; font-size: 16px; margin-bottom: 20px;">Si necesitas más información, por favor contacta al administrador del sitio.</p>
      <a href="${config.baseUrl}" style="background-color: #007bff; color: #fff; padding: 10px 20px; border-radius: 5px; text-decoration: none; margin-bottom: 20px;">Ir al sitio</a>
      `;
      const user = {
        email: product.owner,
      };
      this.mail.send(user, 'Producto eliminado', html);
    }
    CartService.deleteOneProductOnManyCarts(id);

    return this.dao.deleteByID(id);
  };
}
