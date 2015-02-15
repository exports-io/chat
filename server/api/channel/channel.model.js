'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var ChannelSchema = new Schema({
  SEQ: {
    type: String
  },
  name: {
    type: String,
    lowercase: true,
    unique: true
  },
  is_channel: {
    type: Boolean
  },
  created: {
    type: Date, default: Date.now
  },
  creator: {
    type: String
  },
  is_archived: {
    type: Boolean
  },
  is_general: {
    type: Boolean
  },
  is_member: {
    type: Boolean
  },
  members: [
    {type: String}
  ],
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
