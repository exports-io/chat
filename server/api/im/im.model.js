'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ImSchema = new Schema({
  SEQ: String,
  is_im: Boolean,
  user: String,
  created: Number,
  is_user_deleted: Boolean
});

module.exports = mongoose.model('Im', ImSchema);
