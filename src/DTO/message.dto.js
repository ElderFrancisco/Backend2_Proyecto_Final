export default class MessageCreateDTO {
  constructor(message) {
    this.user = message?.user
    this.message = message?.message 
  }
}
