'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var ChannelSchema = new Schema({
  name: {type: String, unique: true},
  is_channel: Boolean,
  created: {type: Date, default : Date.now},
  creator: String,
  is_archived: Boolean,
  is_general: Boolean,
  is_member: Boolean,
  members: [String],
  purpose: {
    value: String,
    creator: String,
    last_set: Number
  },
  topic: {
    value: String,
    creator: String,
    last_set: Number
  }
});

module.exports = mongoose.model('Channel', ChannelSchema);
