import UserCreateDTO from '../DTO/users/users.dto.js';
import UserUpdateDTO from '../DTO/users/usersUpdate.dto.js';

export default class UserRepository {
  constructor(dao) {
    this.dao = dao;
  }

  getByID = async (id) => {
    return this.dao.getByID(id);
  };
  getByCartID = async (id) => {
    return this.dao.getByQuery({ cartId: id });
  };
  getByEmail = async (email) => {
    return this.dao.getByQuery({ email: email });
  };
  create = async (data) => {
    const dataToInsert = new UserCreateDTO(data);
    return this.dao.create(dataToInsert);
  };
  update = async (data) => {
    const dataToInsert = new UserUpdateDTO(data);
    return this.dao.update(dataToInsert);
  };
  premium = async (data) => {
    const dataToInsert = new UserUpdateDTO(data);
    dataToInsert.rol = 'premium';
    return this.dao.update(dataToInsert);
  };
}
