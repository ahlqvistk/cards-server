const most = require('most');
const {create} = require('@most/create');

module.exports = function createSocketAction$(nsp) {
  const socket$ = most.fromEvent('connection', nsp);

  const connect$ = socket$.map((socket) => ({
    type: 'player connected',
    payload: {socket},
  }));

  const disconnect$ = create((add, end, error) => {
    socket$.observe((socket) => {
      socket.on('disconnect', () => {
        add({
          type: 'player disconnected',
          payload: {socketId: socket.id},
        });
      });
    });
  });

  const player$ = create((add, end, error) => {
    socket$.observe((socket) => {
      socket.on('action', (data) => {
        add({
          type: 'client ' + data.type,
          payload: {
            socket,
            socketId: socket.id,
            data: data.payload,
          },
        });
      });
    });
  });

  return most.merge(connect$, disconnect$, player$);
};
