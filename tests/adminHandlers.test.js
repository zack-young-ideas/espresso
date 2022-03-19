const database = require('../lib/database');
const forms = require('../lib/admin/forms');
const handlers = require('../lib/admin/handlers');

jest.mock('../lib/database');
jest.mock('../lib/admin/forms');

describe('homepage handler', () => {
  describe('GET requests', () => {
    it('should render homepage.html template', () => {
      const res = { render: jest.fn() };

      handlers.homepage.get({}, res);

      expect(res.render).toHaveBeenCalledWith('admin/homepage');
    });
  });
});

describe('blog overview page handler', () => {
  describe('GET requests', () => {
    it('should render blogOverview.html template', async () => {
      const res = { render: jest.fn() };
      const blogPosts = [];
      database.getBlogPosts = jest.fn(() => blogPosts);

      await handlers.blogOverview.get({}, res);

      expect(res.render)
        .toHaveBeenCalledWith('admin/blogOverview', { posts: blogPosts });
    });
  });
});

describe('login page handler', () => {
  describe('GET requests', () => {
    it('should render login.html template', () => {
      const res = { render: jest.fn() };

      handlers.login.get({}, res);

      expect(res.render).toHaveBeenCalledWith('admin/login');
    });
  });
});

describe('create blog post page handler', () => {
  describe('GET requests', () => {
    it('should render blogPost.html template', () => {
      const res = { render: jest.fn() };

      handlers.createBlogPost.get({}, res);

      expect(res.render).toHaveBeenCalledWith('admin/blogPost');
    });
  });

  describe('POST requests', () => {
    it('should construct a new BlogPostForm object', async () => {
      const req = { body: {} };
      const res = { render: jest.fn() };

      await handlers.createBlogPost.post(req, res);

      expect(forms.BlogPostForm).toHaveBeenCalledTimes(1);
      expect(forms.BlogPostForm).toHaveBeenCalledWith(req.body);
    });

    it('should display error message given invalid data', async () => {
      const req = {};
      const res = { render: jest.fn() };
      forms.BlogPostForm = jest.fn(() => ({
        isValid: () => false,
        error: 'Invalid form data',
      }));

      await handlers.createBlogPost.post(req, res);

      expect(res.render).toHaveBeenCalledWith(
        'admin/blogPost',
        { errMessage: 'Invalid form data' },
      );
    });

    it('should call create new blog post given valid data', async () => {
      const req = {};
      const res = { redirect: jest.fn() };
      const formObject = { isValid: () => true };
      forms.BlogPostForm = jest.fn(() => formObject);

      expect(database.createBlogPost).toHaveBeenCalledTimes(0);

      await handlers.createBlogPost.post(req, res);

      expect(database.createBlogPost).toHaveBeenCalledTimes(1);
      expect(database.createBlogPost).toHaveBeenCalledWith(formObject);
    });
  });
});
