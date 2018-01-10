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
    title: variables.title,
  });
});

function capitalize(val){
  return (val).charAt(0).toUpperCase() + (val).slice(1).toLowerCase();
}

// Login Process
router.post('/login', function(req, res, next){
  // Definitely not the most elegant way but I'll come back to this later.
  // Finds a user with the entered details and save their details in session
  User.findOne({reg:req.body.reg}, (err, user) => {
    if(err) throw err;
    if(user){
      if(user.reg == 00000) {
        req.session.username = (user.fname).toUpperCase();
        console.log(req.session.username);
      } else {
        req.session.username = capitalize(user.fname) + ' ' + capitalize(user.lname);
      }
      req.session.dpURL = user.dpURL;
      req.session.user = user;
      console.log('------Login route------');
      console.log(req.session);
      console.log('============');
      console.log(res.locals.user);

      // Actual login authentication
      // Including this within the findOne func since its async
      // and in a few cases login went in before the session variables were set
      // definitely not the best way could've used promises or callbacks
      // meh.. it works for now :)
      passport.authenticate('local', {
        successRedirect:'/',
        failureRedirect:'/auth/login',
        failureFlash: true
      })(req, res, next);
    }
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
  req.checkBody('branch', 'Please Select your Branch, if not a student select NA').notEmpty();
  req.checkBody('type', 'Please select your user type - Student/Professor/Staff').notEmpty();

  // Generate newUser
  // fname, lname and email are converted to lowercase
  // before being pushed to the database
  var newUser = new User({
    fname : (req.body.fname).toLowerCase(),
    lname : (req.body.lname).toLowerCase(),
    email : (req.body.email).toLowerCase(),
    reg : req.body.reg,
    password : req.body.password,
    branch: req.body.branch,
    type: req.body.type,
    tags: req.body.tags
  });

  // Get validationErrors
  var errors = req.validationErrors();
  //console.log(errors);
  // Check for an existing user
  // First Check for an existing user with email
  User.findOne({email:newUser.email}, function(err, user){
    if(err) throw err;
    if(user){
      var emailError = [{
        param: 'email',
        msg: 'A User with that Email id already exists. In the event of a lost Password click on "Forgot Password" on the Login page or contact the Administrator',
        value:  newUser.email
      }]
      // if reg no exists re-render the page with error
      res.render('register', {
        title: variables.title,
        errors: emailError
      });
    }else {
      // if email does not exist check for reg no
      // Second Check for an existing user with reg no
      User.findOne({reg:newUser.reg}, function(err, user){
        if(err) throw err;
        if(user){
          var regError = [{
            param: 'reg',
            msg: 'A User with that Registration ID already exists. In the event of a lost Password click on "Forgot Password" on the Login page or contact the Administrator',
            value:  newUser.reg
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
            // newUser can finally be added to the db
            // Hash Password before saving
            bcrypt.genSalt(10, (err, salt) => {
              bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) {
                  console.log(err);
                }
                // password value is changed to hash
                newUser.password = hash;
                // newUser is saved with password = hash
                newUser.save((err) => {
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

// Logout Route
router.get('/logout', (req, res) => {
  req.logout();
  //res.status(200).clearCookie('connect.sid',{path: '/'});
  //req.flash('success', "You have Logged Out");
  // Reset variables saved in session
  // - (not needed anymore since session is being destroyed)
  // leaving it in anyway for redundancy
  req.session.username = null;
  req.session.dpURL = null;
  req.session.user = null;
  res.locals.user = null;

  req.session.destroy(function() {
    res.clearCookie('connect.sid');
    res.redirect('/auth/login');
  });
});


module.exports = router;