'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var ImSchema = new Schema({
  SEQ: String,
  is_im: Boolean,
  users: Array,
  created: Number,
  is_user_deleted: Boolean
});


ImSchema
  .pre('save', function (next) {
    this.SEQ = 'D' + Math.floor((Math.random() * 100000000) + 1);
    next();
  });

module.exports = mongoose.model('Im', ImSchema);
