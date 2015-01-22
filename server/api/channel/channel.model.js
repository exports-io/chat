'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var ChannelSchema = new Schema({
  name: String,
  is_channel: Boolean,
  created: Date,
  creator: String,
  is_archived: Boolean,
  is_general: Boolean,
  is_member: String,
  members: [],
  purpose: {
    value: String,
    creator: String,
    last_set: Number
  },
  topic: {
    value: String,
    creator: String,
    last_set: Number
  },
  num_members: Number
});

module.exports = mongoose.model('Channel', ChannelSchema);
