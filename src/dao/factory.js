import config from '../config/config.js';
import mongoose from 'mongoose';

export let Cart;
export let Message;
export let Product;
export let User;
export let Ticket;
export let Reset;

console.log('PERSISTENCE: ', config.persistence);

switch (config.persistence) {
  case 'FILE':
    const { default: CartFile } = await import('./file/carts.File.js');
    const { default: MessageFile } = await import('./file/message.File.js');
    const { default: ProductFile } = await import('./file/product.File.js');
    const { default: UserFile } = await import('./file/users.File.js');
    const { default: TicketFile } = await import('./file/tickets.File.js');
    const { default: ResetFile } = await import('./file/Reset.File.js');

    Cart = CartFile;
    Message = MessageFile;
    Product = ProductFile;
    User = UserFile;
    Ticket = TicketFile;
    Reset = ResetFile;

    break;

  case 'MONGO':
    await mongoose
      .connect(config.mongo_url, { dbName: config.mongo_name })
      .then(() => {
        console.log('db connected');
      })
      .catch((e) => {
        console.log('error al conectar mongo: ' + e);
      });

    const { default: CartMongo } = await import('./mongo/carts.mongo.js');
    const { default: MessageMongo } = await import('./mongo/messages.mongo.js');
    const { default: ProductMongo } = await import('./mongo/products.mongo.js');
    const { default: UserMongo } = await import('./mongo/users.mongo.js');
    const { default: TicketMongo } = await import('./mongo/tickets.mongo.js');
    const { default: ResetMongo } = await import('./mongo/reset.mongo.js');

    Cart = CartMongo;
    Message = MessageMongo;
    Product = ProductMongo;
    User = UserMongo;
    Ticket = TicketMongo;
    Reset = ResetMongo;

    break;
  default:
    throw new Error(`Persistence don't recognized`);
}
