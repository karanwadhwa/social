// Router file for login and registration
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

const variables = require('../variables');
require('../config/passport')(passport);
const config = require('../config/database');

// Import User Model
let User = require('../models/user');

// Login GET route
router.get('/login', (req, res) => {
  res.render('login', {
    title: variables.title
  });
});

// Login Process
router.post('/login', function(req, res, next){
  passport.authenticate('local', {
    successRedirect:'/',
    failureRedirect:'/auth/login',
    failureFlash: true
  })(req, res, next);
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
  //console.log(errors);
  // Check for an existing user
  let regQuery = {"reg":req.body.reg};
  let emailQuery = {"email":req.body.email};

  // First Check for an existing user with email
  emailFlag = User.findOne(emailQuery, function(err, user){
    if(err) throw err;
    if(user){
      var emailError = [{
        param: 'email',
        msg: 'A User with that email id already exists. In the event of a lost Password click on "Forgot Password" on the Login page or contact the Administrator',
        value:  user.email
      }]
      // if the email exists re-render the page with error
      res.render('register', {
        title: variables.title,
        errors: emailError
      });
    }else {
      // if email does not exist check for reg no
      // Second Check for an existing user with reg no
      regFlag = User.findOne(regQuery, function(err, user){
        if(err) throw err;
        if(user){
          var regError = [{
            param: 'reg',
            msg: 'A User with that Registration ID already exists. In the event of a lost Password click on "Forgot Password" on the Login page or contact the Administrator',
            value:  req.body.reg
          }]
          // if reg no exists re-render the page with error
          res.render('register', {
            title: variables.title,
            errors: regError
          });
        } else {
          // since neither email nor reg no exist in the db
          //it now checks for validationErrors from #48
          if(errors) {
            // if there are any validation errors they are stored in var errors and page re-renders
            res.render('register', {
              title: variables.title,
              errors: errors
            });
          }else {
            // Once all error checking is finished
            //it finally moves to storing the user to the db
            // fname, lname and email are converted to lowercase
            //before being pushed to the database
            var user = new User({
              fname : (req.body.fname).toLowerCase(),
              lname : (req.body.lname).toLowerCase(),
              email : (req.body.email).toLowerCase(),
              reg : req.body.reg,
              password : req.body.password
            });

            // Hash Password before saving
            bcrypt.genSalt(10, (err, salt) => {
              bcrypt.hash(user.password, salt, (err, hash) => {
                if (err) {
                  console.log(err);
                }
                // password value is changed to hash
                user.password = hash;
                // new user is saved with password = hash
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
        }
      });
    }
  });

});

module.exports = router;