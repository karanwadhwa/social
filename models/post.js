const mongoose = require('mongoose');

var postSchema = mongoose.Schema({
  authorID: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  imgURL: {
    type: String
  },
  attachments: {
    type: String
  },
  sharedTo: {
    type: String,
    required: true,
    default: 'public'
  }
});

var Post = module.exports = mongoose.model('Post', postSchema);