const database = require('../database');
const forms = require('./forms');
const userForms = require('../setup/forms');

const handlers = {};

handlers.homepage = {

  get: (req, res) => {
    res.render('admin/homepage');
  },

};

handlers.login = {

  get: (req, res) => {
    res.render('admin/login');
  },

};

handlers.logout = {

  get: (req, res) => {
    req.logout();
    res.redirect(303, '/admin/login');
  },

};

handlers.blogOverview = {

  get: async (req, res) => {
    const context = { posts: await database.getBlogPosts() };
    res.render('admin/blogOverview', context);
  },

};

handlers.createBlogPost = {

  get: (req, res) => {
    res.render('admin/blogPost');
  },

  post: async (req, res) => {
    const form = new forms.BlogPostForm(req.body);
    if (form.isValid()) {
      try {
        await database.createBlogPost(form);
        res.redirect(303, '/admin');
      } catch (error) {
        if (error.code === 11000) {
          const errMessage = `Slug '${form.slug}' has already been used.`;
          res.render('admin/blogPost', { errMessage });
        } else {
          res.status(500).render('public/500');
        }
      }
    } else {
      res.render('admin/blogPost', { errMessage: form.error });
    }
  },

};

handlers.userOverview = {

  get: async (req, res) => {
    const context = { users: await database.getUsers() };
    res.render('admin/userOverview', context);
  },

};

handlers.createUser = {

  get: (req, res) => {
    res.render('admin/user');
  },

  post: (req, res) => {
    const form = new userForms.UserForm(req.body);
    if (form.isValid()) {
      try {
        database.createUser(form);
        res.redirect(303, '/admin/auth/user');
      } catch (error) {
        res.status(500).render('public/500');
      }
    } else {
      res.render('admin/user', { errMessage: form.error });
    }
  },

};

module.exports = handlers;
