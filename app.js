const express = require('express');
const path = require('path');

// Set port
const port = 3000;
const app = express();

// Load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Home route
app.get('/', (req, res) => {
  res.render('index', {
    title: 'Social'
  });
});

// Start server
app.listen(port, () => {
  console.log('Server started on port: '+port);
});