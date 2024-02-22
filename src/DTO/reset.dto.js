export default class ResetCreateDTO {
  constructor(reset) {
    this.dateEnd = reset?.dateEnd || new Date(Date.now() + 1 * 60 * 60 * 1000);
    this.UserId = reset?.UserId;
    this.Code = reset?.Code || Math.random().toString(36).substring(2, 17);
  }
}
