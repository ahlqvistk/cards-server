module.exports = function createTableActionEvents(name, tableEvents, action$) {
  action$.observe((action) => {
    switch (action.type) {
    case 'player connected':
      tableEvents.emit('event', {
        type: 'player joined table',
        payload: {
          name,
        },
      });
      break;
    case 'player disconnected':
      tableEvents.emit('event', {
        type: 'player left table',
        payload: {
          name,
        },
      });
      break;
    case 'client start game':
      tableEvents.emit('event', {
        type: 'table changed status',
        payload: {
          name,
          status: 'game started',
        },
      });
      break;
    case 'change status':
      if (action.payload === 'waiting for players') {
        tableEvents.emit('event', {
          type: 'table changed status',
          payload: {
            name,
            status: 'open',
          },
        });
      }

      if (action.payload === 'waiting to start game') {
        tableEvents.emit('event', {
          type: 'table changed status',
          payload: {
            name,
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
      name,
    },
  });
};
