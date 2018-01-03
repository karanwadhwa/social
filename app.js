const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const expressValidator = require('express-validator');
const passport = require('passport');
const bluebird = require('bluebird');

const variables = require('./variables');
const config = require('./config/database');

// Mongo connection
// Mongoose promise library is deprecated using bluebird instead
mongoose.Promise = bluebird;
// changed mongoose.connect('blahblah') to connection.openUri('blahblah') because of a deprecationWarning
// check this thread for more info  https://github.com/Automattic/mongoose/issues/5399
// lol switched it back to connect and added useMongoClient no idea what it does but gets rid of the warning
mongoose.connect(config.database, {useMongoClient: true});
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

// BodyParser middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

// Express Session Middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));

//Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Express Validator Middleware v3.2 (latest is v4.3)
// used older version to stay in sync with a previous project
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Passport Config
require('./config/passport')(passport);
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Enable global user variable for all URLs
app.get('*', (req,res,next) => {
  res.locals.user = req.user || null;
  next();
});

// Home route
app.get('/', ensureAuthenticated, (req, res) => {
  res.render('home', {
    name: variables.name,
    title: variables.title,
    username: req.session.username,
    pageHeader: 'Home',
  });
  // resetting session.username to null after use
  // but i might not want to do that just yet
  //req.session.username = null;
});

// Access Control
function ensureAuthenticated(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }
  else {
    req.flash('error', 'You need to be logged in to access this page');
    res.redirect('/auth/login');
  }
}

// Route Files
const authRoute = require('./routes/auth');

app.use('/auth', authRoute);

// Start server
app.listen(port, () => {
  console.log('Server started on port: '+port);
});