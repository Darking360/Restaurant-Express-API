
/*!
 * Module dependencies
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * User schema
 */

var UserSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'user', 'restaurant'],
    default: 'user',
  },
  address: {
    type: String,
    required: false,
  },
  name: {
    type: String,
    required: false,
  },
  age: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: false,
    default: '',
  }
});

module.exports = mongoose.model('User', UserSchema);
