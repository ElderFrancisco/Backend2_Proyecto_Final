import config from '../config/config.js';
import ResetCreateDTO from '../DTO/reset.dto.js';
import Mail from '../util/mail.js';
import { UserService } from './index.js';

export default class ResetRepository {
  constructor(dao) {
    this.dao = dao;
    this.mail = new Mail();
  }
  getByIdAndCode = async (id, code) => {
    const query = { _id: id, Code: code };
    return this.dao.getByQuery(query);
  };
  create = async (data) => {
    const user = await UserService.getByID(data.UserId);
    const dataToInsert = new ResetCreateDTO(data);
    const reset = await this.dao.create(dataToInsert);

    let html = `

    <h1 style="color: #333; font-size: 24px; margin-bottom: 20px;">Restablecer contraseña</h1> 
    <p style="color: #666; font-size: 16px; margin-bottom: 20px;">Por favor, presione el siguiente enlace para restablecer su contraseña</p>
    <a href="${config.baseUrl}/reset-password/${reset._id}/${reset.Code}" style="display: inline-block; background-color: #007bff; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 5px; transition: background-color 0.3s ease;">Restablecer contraseña</a>
`;

    const result = this.mail.send(user, 'Restablecer contraseña', html);

    return result;
  };

  deleteById = async (id) => {
    return this.dao.delete(id);
  };
  resetPassword = async (id, code, password) => {
    return this.dao.update(id, code, password);
  };
}
