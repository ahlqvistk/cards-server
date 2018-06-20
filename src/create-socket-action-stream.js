const most = require('most');
const {create} = require('@most/create');

module.exports = function createSocketAction$(io) {
  const socket$ = most.fromEvent('connection', io);

  const connect$ = socket$.map((socket) => ({
    type: 'player connected',
    payload: socket,
  }));

  const disconnect$ = create((add, end, error) => {
    socket$.observe((socket) => {
      socket.on('disconnect', () => {
        add({
          type: 'player disconnected',
          payload: socket.id,
        });
      });
    });
  });

  const player$ = create((add, end, error) => {
    socket$.observe((socket) => {
      socket.on('action', (data) => {
        add({
          type: data.action,
          payload: {
            id: socket.id,
            data: data,
          },
        });
      });
    });
  });

  return most.merge(connect$, disconnect$, player$);
};
