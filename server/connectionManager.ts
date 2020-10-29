import sio from 'socket.io';

export function startListeners(io: sio.Server) {
  io.on('connection', (socket: sio.Socket) => {
    io.to(socket.id).emit('debug', `You are connected with id: ${socket.id}`);


    socket.on('subscribe', (pair: string) => {
      console.log(`client ${socket.id}  subscribed to pair ${pair}`);
      socket.join('BTC_ETH');
      io.to(socket.id).emit('orderBookLoaded', {
        ask: {
          "0.02951622": "0.51356264",
          "0.02951623": "10.00000000",
        },
        bid: {
          "0.02948701": "37.52211494",
          "0.02710100": "0.01000000",
        },
      });
    });
  });
}