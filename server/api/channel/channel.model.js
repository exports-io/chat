'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var ChannelSchema = new Schema({
  SEQ: String,
  name: {type: String, unique: true},
  is_channel: Boolean,
  created: {type: Date, default: Date.now},
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


ChannelSchema
  .pre('save', function (next) {
    this.SEQ = 'C' + Math.floor((Math.random() * 100000000) + 1);
    next();
  });

module.exports = mongoose.model('Channel', ChannelSchema);
