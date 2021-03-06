module.exports = function update(lobby, {type, payload}) {
  switch (type) {
  case 'add table': {
    const tables = lobby.tables.concat({id: payload.id, type: payload.type});
    return {...lobby, tables};
  }
  case 'player connected': {
    return lobby;
  }
  case 'player joined table': {
    return lobby;
  }
  case 'player left table': {
    return lobby;
  }
  case 'table changed status': {
    return lobby;
  }
  default:
    return lobby;
  }
};
