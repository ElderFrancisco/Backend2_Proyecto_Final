import { Product, Cart, User, Ticket, Message, Reset } from '../dao/factory.js';

//import UserRepository from './users.repository.js';
//import TicketRepository from './tickets.repository.js';
import ProductRepository from './products.repository.js';
import CartRepository from './carts.repository.js';
import UserRepository from './users.repository.js';
import TicketRepository from './tickets.repository.js';
import MessageRepository from './message.repository.js';
import ResetRepository from './reset.repository.js';

//export const UserService = new UserRepository(new User());
//export const TicketService = new TicketRepository(new Ticket());
export const ProductService = new ProductRepository(new Product());
export const CartService = new CartRepository(new Cart());
export const UserService = new UserRepository(new User());
export const TicketService = new TicketRepository(new Ticket());
export const MessageService = new MessageRepository(new Message());
export const ResetService = new ResetRepository(new Reset());
