/**
 * Top-level script to initialize and configure web application object.
 */

const path = require('path');

const bodyParser = require('body-parser');
const express = require('express');
const expressNunjucks = require('express-nunjucks');
const LocalStrategy = require('passport-local');
const passport = require('passport');
const session = require('express-session');

const adminRouter = require('./src/admin/router');
const database = require('./src/database');
const middleware = require('./src/middleware');
const settings = require('./config');
const setupRouter = require('./src/setup/router');

const app = express();
const port = 3000;

// Enable cookies-based sessions.
app.use(session({
  secret: settings.secretKey,
  resave: false,
  saveUninitialized: false,
}));

// Configure Passport.
passport.use(new LocalStrategy(
  {
    usernameField: 'username',
    passwordField: 'password',
  },
  database.getUserByUsername,
));
app.use(passport.authenticate('session'));
passport.serializeUser((user, callback) => {
  process.nextTick(() => {
    callback(null, {
      id: user._id, // eslint-disable-line
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      admin: user.admin,
    });
  });
});
passport.deserializeUser((user, callback) => {
  process.nextTick(() => callback(null, user));
});

// Serve static files.
app.use('/static', express.static('static'));

// Configure the Nunjucks template engine.
app.set('views', path.join(__dirname, '/templates'));
expressNunjucks(app, { noCache: true });

// Enable body parsing.
app.use(bodyParser.urlencoded({ extended: true }));

app.use(middleware.setupComplete);

app.get('/', (req, res) => {
  res.render('public/homepage');
});
app.use('/setup', setupRouter);
app.use('/admin', adminRouter);
app.use((req, res) => {
  res.status(404).render('public/404');
});

if (require.main === module) {
  settings.initializeSettings(() => {
    if (settings.databaseUri) {
      database.connect(settings.databaseSettings);
    }
    app.listen(port, () => {
      console.log(`Listening on port ${port}...`); // eslint-disable-line
    });
  });
} else {
  module.exports = app;
}
