const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
const bcrypt = require('bcryptjs');

const User = require('../models/user');
const config = require('../config/database');
const variables = require('../variables');

module.exports = function(passport){
  // Local Strategy
  passport.use(new LocalStrategy({
    usernameField: variables.usernameField,
    passwordField: variables.passwordField
  },
    function(reg, password, done){

    // Match Username
    let query = {reg:reg};
    User.findOne(query, function(err, user){
      if(err) throw err;
      if(!user){
        return done(null, false, {message: 'Invalid credentials'});
      }

      // Match Password
      bcrypt.compare(password, user.password, function(err, isMatch){
        if(err) throw err;
        if(isMatch){
          return done(null, user);
        } else {
          return done(null, false, {message: 'Invalid Credentials'});
        }
      });
    });
  }));

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
}