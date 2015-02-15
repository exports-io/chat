/**
 * Socket.io configuration
 */

'use strict';

var config = require('./environment');

function onDisconnect(socketio, socket) {
  socketio.sockets.emit('userDisconnected');
}

function onConnect(socketio, socket) {

  require('../api/chat/chat.socket').register(socketio, socket);
  require('../api/channel/channel.socket').register(socket);
  require('../api/im/im.socket').register(socket);

  socket.on('join', function (room) {
    socket.join(room.SEQ);
  });

  socket.on('leave', function (room) {
    socket.leave(room.SEQ);
  });

  socket.on('userConnected', function (user) {
    socketio.sockets.emit('newUserConnected', user);
  })
}

module.exports = function (socketio) {

  socketio.on('connection', function (socket) {
    socket.address = socket.handshake.address !== null ?
    socket.handshake.address.address + ':' + socket.handshake.address.port : process.env.DOMAIN;

    socket.connectedAt = new Date();

    socket.on('disconnect', function () {
      onDisconnect(socketio, socket);
      console.info('[%s] DISCONNECTED', socket.address);
    });

    onConnect(socketio, socket);
    console.info('[%s] CONNECTED', socket.address);
  });
};
