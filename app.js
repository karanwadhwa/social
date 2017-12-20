const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const variables = require('./variables');

// Mongo connection
// changed mongoose.connect('blahblah') to connection.openUri('blahblah') because of a deprecationWarning
// check this thread for more info  https://github.com/Automattic/mongoose/issues/5399
// lol switched it back to connect and added useMongoClient no idea what it does but gets rid of the warning
mongoose.connect('mongodb://localhost/social', {useMongoClient: true});
let db = mongoose.connection;

// Check db connection
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Check for db errors
db.on('error', (err) => {
  console.log(err);
});

// Set port
const port = 3000;
const app = express();

// Import Models
let User = require('./models/user');

// Load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));

// Home route
app.get('/', (req, res) => {
  res.render('index', {
    title: variables.title
  });
});

// Route Files
const authRoute = require('./routes/auth');

app.use('/auth', authRoute);

// Start server
app.listen(port, () => {
  console.log('Server started on port: '+port);
});