const mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  fname: {
    type: String,
    required: true
  },
  lname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  reg: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

var User = module.exports = mongoose.model('User', userSchema);