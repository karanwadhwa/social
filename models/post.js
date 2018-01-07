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
    default: new Date(),
    required: true
  },
  title: {
    type: String
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
  },
/*   stats: {
    likes: [
      users: {
        id: String,
        name: String,
        reg: String
      }
    ],
    comments: [{
      author: {
        type: String,
        required: true
      },
      comment: {
        type: String,
        required: true
      }
    }]
  } */
});

var Post = module.exports = mongoose.model('Post', postSchema);