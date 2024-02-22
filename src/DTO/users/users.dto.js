export default class UserCreateDTO {
  constructor(user) {
    this.first_name = user?.first_name || '';
    this.last_name = user?.last_name || '';
    this.email = user?.email || '';
    this.age = user?.age || 0;
    this.password = user?.password || '';
    this.rol = user?.rol || 'user';
    this.cartId = user?.cartId || '';
  }
}
