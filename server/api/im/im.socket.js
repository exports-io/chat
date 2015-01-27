/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Im = require('./im.model');

exports.register = function (socket) {
  Im.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Im.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });

  socket.on("im:startTyping", function (data) {
    socket.broadcast.emit("im:isTyping", data);
  });

  socket.on("im:stopTyping", function (data) {
    socket.broadcast.emit("im:isNotTyping", data);
  });

};

function onSave(socket, doc, cb) {
  socket.emit('im:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('im:remove', doc);
}
