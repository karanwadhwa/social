const LocalStrategy = require('passport-local');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const config = require('../config/database');
const User = require('../models/user');

module.exports = (passport) => {
  console.log('module.exports');
  // Local Strategy
  passport.use(new LocalStrategy(function(email, password, done){
    console.log('passport.use function');
    // Find User
    User.findOne({email:email}, (err, user) => {
      console.log('user.findone function');
      if(err) throw err;
      if(!user) {
        return done(null, false, {message: 'Invalid Username'});
        console.log(email+': user not found');
      }
      if(user){
        console.log('user found');
      }

      // Decrypt and compare Passwords
      bcrypt.compare(password, user.password, (err, passwordMatch) => {
        console.log('bcrypt.compare function');
        if(err) throw err;
        if(isMatch) {
          return done(null, user);
          console.log(email+': correct login : '+password);
        } else {
          return done(null, false, {message: 'Invalid Password'});
          console.log(email+': password incorrect :'+password);
        }
      });
    });
  }));

  // Not entirely sure what this does
  // copypasta from passport documentation
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
}