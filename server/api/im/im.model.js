'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ImSchema = new Schema({
  user: String,
  text: String,
  type: {type: String, default: "message"},
  ts: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Im', ImSchema);
