/**
 * Top-level script to initialize and configure web application object.
 */

const path = require('path');

const bodyParser = require('body-parser');
const express = require('express');
const expressNunjucks = require('express-nunjucks');
const helmet = require('helmet');
const LocalStrategy = require('passport-local');
const passport = require('passport');
const session = require('express-session');

const adminRoutes = require('./lib/admin/routes');
const database = require('./lib/database');
const middleware = require('./lib/middleware');
const settings = require('./config');
const setupRoutes = require('./lib/setup/routes');

const app = express();

app.use(helmet());

// Enable cookies-based sessions.
app.use(session({
  secret: settings.secretKey,
  name: 'sessionId',
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
      id: user._id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    });
  });
});
passport.deserializeUser((user, callback) => {
  process.nextTick(() => callback(null, user));
});

// Serve static files.
app.use('/static', express.static(path.join(__dirname, 'public')));

// Serve TinyMCE files.
app.use(
  '/tinymce',
  express.static(path.join(__dirname, 'node_modules', 'tinymce'))
);

// Configure the Nunjucks template engine.
app.set('views', path.join(__dirname, 'views'));
expressNunjucks.default(app, { noCache: true });

// Enable body parsing.
app.use(bodyParser.urlencoded({ extended: true }));

app.use(middleware.setupComplete);
app.use(middleware.adminRedirect);

app.get('/', async (req, res) => {
  const context = { posts: await database.getPublishedBlogPosts() };
  res.render('public/homepage', context);
});
app.get('/blog/post/:slug', async (req, res) => {
  try {
    const blogPost = await database.getBlogPostBySlug(req.params.slug);
    res.render('public/blogPost', { post: blogPost });
  } catch {
    res.status(404).render('public/404');
  }
});
app.use('/setup', setupRoutes);
app.use('/admin', adminRoutes);
app.use((req, res) => {
  res.status(404).render('public/404');
});

module.exports = app;
