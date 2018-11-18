
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
  fullName: {
    type: String,
    required: false,
  },
  age: {
    type: String,
    required: false,
  }
});

module.exports = mongoose.model('User', UserSchema);
