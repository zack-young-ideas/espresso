const express = require('express');
const passport = require('passport');

const handlers = require('./handlers');

const router = express.Router();

router.get('/', handlers.homepage.get);
router.get('/login', handlers.login.get);
router.post('/login', passport.authenticate('local', {
  successRedirect: '/admin',
  failureRedirect: '/admin/login',
}));
router.get('/blog/post', handlers.blogOverview.get);
router.get('/blog/post/add', handlers.createBlogPost.get);
router.post('/blog/post/add', handlers.createBlogPost.post);

module.exports = router;
