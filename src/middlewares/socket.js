import { Server } from 'socket.io';
import { MessageService } from '../repository/index.js';

export default (appServer) => {
  const io = new Server(appServer);

  io.on('connection', async (socket) => {
    socket.emit('Chat', await MessageService.get());

    socket.on('newChat', async (message) => {
      await MessageService.create(message);

      io.emit('Chat', await MessageService.get());
    });
  });
};
