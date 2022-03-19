const database = require('../database');
const forms = require('./forms');

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

handlers.blogOverview = {

  get: async (req, res) => {
    const context = { posts: await database.getBlogPosts() };
    res.render('admin/blogOverview', context);
  },

}

handlers.createBlogPost = {

  get: (req, res) => {
    res.render('admin/blogPost');
  },

  post: (req, res) => {
    const form = new forms.BlogPostForm(req.body);
    if (form.isValid()) {
      try {
        database.createBlogPost(form);
        res.redirect(303, '/admin');
      } catch (error) {
        res.status(500).render('public/500');
      }
    } else {
      res.render('admin/blogPost', { errMessage: form.error });
    }
  },

};

module.exports = handlers;
