/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Channel = require('./channel.model');

exports.register = function(socket) {
  Channel.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Channel.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('channel:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('channel:remove', doc);
}