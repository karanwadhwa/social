const mongoose = require('mongoose');
const variables = require('../variables');

var userSchema = mongoose.Schema({
  fname: {
    type: String,
    required: true
  },
  lname: {
    type: String,
    required: true
  },
  dpURL: {
    type: String,
    default: variables.defaultDpURL,
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
  },
  branch: {
    type: String,
    required: true,
    default: 'na'
  },
  type: {
    type: String,
    required: true
  },
  tags: {
    type: [String]
  }
});

var User = module.exports = mongoose.model('User', userSchema);