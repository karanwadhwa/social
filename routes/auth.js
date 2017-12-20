// Router file for login and registration
const express = require('express');
const router = express.Router();
const variables = require('../variables');

// Import User Model
let User = require('../models/user');

// Login route
router.get('/login', (req, res) => {
  res.render('login', {
    title: variables.title
  });
});

// Register route
router.get('/register', (req, res) => {
  res.render('register', {
    title: variables.title
  });
});

router.post('/register', (req, res) => {
  req.checkBody('fname', 'Please enter your Name').notEmpty();
  req.checkBody('lname', 'Please enter your Name').notEmpty();
  req.checkBody('email', 'Please enter a valid email address').notEmpty().isEmail();
  req.checkBody('reg', 'Please enter a valid Registration id').notEmpty().isLength({min:5, max:5});
  req.checkBody('password', 'Please enter a password').notEmpty();
  req.checkBody('password', 'A minimum password length of 6 characters is required').notEmpty().isLength({min:6});
  req.checkBody('password2', 'Your Passwords do not match').notEmpty().equals(req.body.password);

  // Get errors
  var errors = req.validationErrors();

  if(errors) {
    res.render('register', {
      title: variables.title,
      errors: errors
    });
  } else {
    var user = new User();
    user.fname = req.body.fname;
    user.lname = req.body.lname;
    user.email = req.body.email;
    user.reg = req.body.reg;
    user.password = req.body.password;

    user.save((err) => {
      if(err) {
        console.log(err);
        return;
      } else {
        req.flash('success', 'Registration Successful, Please Login');
        res.redirect('/auth/login');
      }
    });
  }
});

module.exports = router;