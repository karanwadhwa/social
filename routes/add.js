const express = require('express');
const router = express.Router();

const variables = require('../variables');
const config = require('../config/database');

// Import User Model
let User = require('../models/user');

// newPost GET route
router.get('/post', ensureAuthenticated, (req, res) => {
  res.render('newPost', {
    name: variables.name,
    title: variables.title,
    username: req.session.username,
    dpURL: res.locals.user.dpURL,
    pageHeader: 'New Post',
  });
  console.log('------add route------');
  console.log(req.session);
  console.log(res.locals.user);
  // resetting session.username to null after use
  // but i might not want to do that just yet
  //req.session.username = null;
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