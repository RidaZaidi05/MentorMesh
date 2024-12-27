import { Server } from 'socket.io';
import http from 'http';

const createSocketServer = () => {
  const server = http.createServer();
  const io = new Server(server, {
    cors: {
      origin: `${process.env.FRONTEND_URL}`,
      methods: ["GET", "POST"],
      allowedHeaders: ["my-custom-header"],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  return server;
};

export default createSocketServer;
