const mongoose = require('mongoose');

var postSchema = mongoose.Schema({
  author: {
    name: {
      type: String,
      required: true
    },
    id: {
      type: String,
      required: true
    },
    reg: {
      type: String,
      required: true
    }
  },
  date: {
    type: String,
    default: Date.now,
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
  audience: {
    type: [String],
    required: true,
    default: 'public'
  }
});

var Post = module.exports = mongoose.model('Post', postSchema);