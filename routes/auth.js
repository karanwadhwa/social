// Router file for login and registration
const express = require('express');
const router = express.Router();
const variables = require('../variables');

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

module.exports = router;