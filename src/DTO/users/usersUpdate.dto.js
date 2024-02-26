export default class UserUpdateDTO {
  constructor(user) {
    this._id = user?.id;
    this.first_name = user?.first_name;
    this.last_name = user?.last_name;
    this.email = user?.email;
    this.age = user?.age;
    this.password = user?.password;
    this.rol = user?.rol;
    this.cartId = user?.cartId;
    this.documents = user?.documents;
    this.last_connection = user?.last_connection || Date.now();
  }
}
