// Router file for login and registration
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

const variables = require('../variables');


// Import User Model
let User = require('../models/user');

// Login GET route
router.get('/login', (req, res) => {
  res.render('login', {
    title: variables.title
  });
});

// Register GET route
router.get('/register', (req, res) => {
  res.render('register', {
    title: variables.title
  });
});

// Register POST route
router.post('/register', (req, res) => {
  req.checkBody('fname', 'Please enter your Name').notEmpty();
  req.checkBody('lname', 'Please enter your Name').notEmpty();
  req.checkBody('email', 'Please enter a valid email address').notEmpty().isEmail();
  req.checkBody('reg', 'Please enter a valid Registration id').notEmpty().isLength({min:5, max:5});
  req.checkBody('password', 'Please enter a password').notEmpty();
  req.checkBody('password', 'A minimum password length of 6 characters is required').notEmpty().isLength({min:6});
  req.checkBody('password2', 'Your Passwords do not match').equals(req.body.password);

  // Get errors
  var errors = req.validationErrors();

  if(errors) {
    res.render('register', {
      title: variables.title,
      errors: errors
    });
  } else {

    var user = new User({
      fname : req.body.fname,
      lname : req.body.lname,
      email : req.body.email,
      reg : req.body.reg,
      password : req.body.password
    });

    // Hash Password before saving
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        if (err) {
          console.log(err);
        }
        user.password = hash;
        user.save((err) => {
          if(err) {
            console.log(err);
            return;
          } else {
            req.flash('success', 'Registration Successful, Please Login');
            res.redirect('/auth/login');
          }
        });
      });
    });

  }
});

module.exports = router;