/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Chat = require('./chat.model');

exports.register = function (socketio, socket) {
  Chat.schema.post('save', function (doc) {
    onSave(socketio, doc);
  });
  Chat.schema.post('remove', function (doc) {
    onRemove(socketio, doc);
  });

  socket.on("startTyping", function (data) {
    socket.broadcast.to(data.SEQ).emit("isTyping", data);
  });

};

function onSave(socketio, doc, cb) {
  socketio.to(doc.SEQ).emit('chat:save', doc);
}

function onRemove(socketio, doc, cb) {
  socketio.to(doc.SEQ).emit('chat:remove', doc);
}
