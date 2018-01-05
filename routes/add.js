const express = require('express');
const router = express.Router();

const variables = require('../variables');
const config = require('../config/database');

// Import Models
let User = require('../models/user');
let Post = require('../models/post');

// newPost GET route
router.get('/post', ensureAuthenticated, (req, res) => {
  res.render('newPost', {
    name: variables.name,
    title: variables.title,
    username: req.session.username,
    dpURL: req.session.user.dpURL,
    author: req.session.username
  });
  console.log('------add/post GET route------');
  console.log(req.session);
  console.log('============');
  console.log(res.locals.user);
  // resetting session.username to null after use
  // but i might not want to do that just yet
  //req.session.username = null;
});

// newPost POST route (submit post)
router.post('/post', (req,res) => {
  console.log('---- add/post POST route----');
  console.log(req.session);
  console.log('============');
  console.log(res.locals.user);
  req.checkBody('title', 'Post Title cannot be empty').notEmpty();
  req.checkBody('body', 'Post Body cannot be empty').notEmpty();
  //req.checkBody('audience', 'Select an audience for this post').notEmpty();

  // Generate newPost
  var newPost = new Post({
    author: {
      name: req.session.username,
      id: req.session.user._id,
      reg: req.session.user.reg
    },
    title : req.body.title,
    body : req.body.body,
    audience: req.body.audience
  });

  // Get validationErrors
  var errors = req.validationErrors();
  //it now checks for validationErrors
  if(errors) {
    // if there are any validation errors they are stored in var errors and page re-renders
    res.render('newPost', {
      name: variables.name,
      title: variables.title,
      username: req.session.username,
      dpURL: req.session.user.dpURL,
      author: req.session.username,
      errors: errors
    });
  } else {
    // if no errors are found newPost can be saved to the db
    newPost.save((err) => {
      if(err) {
        console.log(err);
        return;
      } else {
        req.flash('success', 'Post saved.');
        res.redirect('/add/post');
      }
    });
  }

});


// Access Control
function ensureAuthenticated(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }
  else {
    req.flash('error', 'You need to be logged in to access this page');
    res.redirect('/auth/login');
  }
}

module.exports = router;