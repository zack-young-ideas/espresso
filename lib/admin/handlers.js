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

handlers.BlogPost = {

  get: async (req, res) => {
    let context;
    if (req.params.slug) {
      const blogPost = await database.getBlogPostBySlug(req.params.slug);
      context = { blogPost };
    } else {
      context = { blogPost: null };
    }
    res.render('admin/blogPost', context);
  },

  post: async (req, res) => {
    const form = new forms.BlogPostForm(req.body);
    if (form.isValid()) {
      if (req.params.slug) {
        try {
          await database.updateBlogPost(form);
          res.redirect(303, '/admin/blog/post');
        } catch (error) {
          const errMessage = 'Unable to update blog post';
          res.render('admin/blogPost', { errMessage });
        }
      } else {
        try {
          form.image = req.file.filename;
          await database.createBlogPost(form);
          res.redirect(303, '/admin/blog/post');
        } catch (error) {
          if (error.code === 11000) {
            const errMessage = `Slug '${form.slug}' has already been used.`;
            res.render('admin/blogPost', { errMessage });
          } else {
            res.status(500).render('public/500');
          }
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
