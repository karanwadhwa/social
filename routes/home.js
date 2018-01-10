// Router file for login and registration
const express = require('express');
const router = express.Router();

const variables = require('../variables');
const config = require('../config/database');

// Import Models
let User = require('../models/user');
let Post = require('../models/post');

// Home route
router.get('/', anyUserLoggedIn, (req, res) => {
  Post.find({}, (err, posts) => {
    if(err) {
      console.log(err);
    }
    else {
      // fetch authors latest dpURL and save it in the posts array before parsing
        var promises = posts.map(function(post){
          return new Promise(function(resolve, reject){
            User.findOne({reg: post.author.reg}, (err, usr) => {
              if (err) { return reject(err); }
              if (usr) {
                post.author.dpURL = usr.dpURL;
                //Post.update({'author.reg': usr.reg}, {$set:{'author.dpURL': usr.dpURL}}, {multi: true});
                resolve();
              }
            });
          });
        });
        // waits for posts.author.dpURL to update before rendering the page
        Promise.all(promises)
          .then(() => {
            res.render('home', {
              name: variables.name,
              title: variables.title,
              username: req.session.username,
              dpURL: req.session.user.dpURL,
              pageHeader: 'Recent Updates',
              pageTitle: 'Home',
              posts: posts.reverse()
            });
          })
          .catch(console.error);
    }
  });
  // resetting session.username to null after use
  // but i might not want to do that just yet
  //req.session.username = null;
});



// Access Control
// ensures that *A* user - ANY user is logged in
function anyUserLoggedIn(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }
  else {
    req.flash('error', 'You need to be logged in to access this page');
    res.redirect('/auth/login');
  }
}

module.exports = router;