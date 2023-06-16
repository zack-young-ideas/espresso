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
router.get('/logout', handlers.logout.get);
router.get('/auth/user', handlers.userOverview.get);
router.get('/auth/user/add', handlers.createUser.get);
router.post('/auth/user/add', handlers.createUser.post);
router.get('/blog/post', handlers.blogOverview.get);
router.get('/blog/post/add', handlers.BlogPost.get);
router.post('/blog/post/add', handlers.BlogPost.post);
router.get('/blog/post/edit/:slug', handlers.BlogPost.get);
router.post('/blog/post/edit/:slug', handlers.BlogPost.post);

module.exports = router;
