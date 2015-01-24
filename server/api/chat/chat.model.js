'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var ChatSchema = new Schema({
  channel: String,
  user: String,
  text: String,
  type: {type: String, default: "message"},
  ts: String
});

module.exports = mongoose.model('Chat', ChatSchema);
