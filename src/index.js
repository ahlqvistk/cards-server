const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');

const createTable = require('./create-table');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

let tables = {};

const publicPath = process.env.CARDS_PUBLIC ?
  path.join(__dirname, process.env.CARDS_PUBLIC) :
  path.join(__dirname, 'public');

app.use('/', express.static(publicPath));
app.use('/table/:table', express.static(publicPath));
app.get('/create/:table', (req, res) => {
  const table = req.params.table;

  if (tables.hasOwnProperty(table)) {
    res.send('Table already exists.');
    return;
  }

  console.log('Creating table', table);
  createTable(table, io);
  tables[table] = 'created';
  res.send(`Table ${table} created.`);
});

const port = process.env.PORT || 8080;
server.listen(port, () => {
  console.log('listening on *:' + port);
});
