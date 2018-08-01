module.exports = function createTableActionEvents(id, tableEvents, action$) {
  action$.observe((action) => {
    switch (action.type) {
    case 'player connected':
      tableEvents.emit('event', {
        type: 'player joined table',
        payload: {
          id,
        },
      });
      break;
    case 'player disconnected':
      tableEvents.emit('event', {
        type: 'player left table',
        payload: {
          id,
        },
      });
      break;
    case 'client start game':
      tableEvents.emit('event', {
        type: 'table changed status',
        payload: {
          id,
          status: 'game started',
        },
      });
      break;
    case 'change status':
      if (action.payload === 'waiting for players') {
        tableEvents.emit('event', {
          type: 'table changed status',
          payload: {
            id,
            status: 'open',
          },
        });
      }

      if (action.payload === 'waiting to start game') {
        tableEvents.emit('event', {
          type: 'table changed status',
          payload: {
            id,
            status: 'closed',
          },
        });
      }
      break;
    default:
      break;
    }
  });

  tableEvents.emit('event', {
    type: 'add table',
    payload: {
      id,
    },
  });
};
