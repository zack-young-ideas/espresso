const database = require('../lib/database');
const forms = require('../lib/admin/forms');
const handlers = require('../lib/admin/handlers');
const userForms = require('../lib/setup/forms');

jest.mock('../lib/database');
jest.mock('../lib/admin/forms');
jest.mock('../lib/setup/forms');

describe('homepage handler', () => {
  describe('GET requests', () => {
    it('should render homepage.html template', () => {
      const res = { render: jest.fn() };

      handlers.homepage.get({}, res);

      expect(res.render).toHaveBeenCalledWith('admin/homepage');
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

describe('logout handler', () => {
  describe('GET requests', () => {
    it('should call logout() method of the request object', () => {
      const req = { logout: jest.fn() };
      const res = { redirect: jest.fn() };

      expect(req.logout).toHaveBeenCalledTimes(0);

      handlers.logout.get(req, res);

      expect(req.logout).toHaveBeenCalledTimes(1);
    });

    it('should redirect to login page', () => {
      const req = { logout: (callback) => callback(null) };
      const res = { redirect: jest.fn() };

      handlers.logout.get(req, res);

      expect(res.redirect).toHaveBeenCalledWith(303, '/admin/login');
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

describe('create blog post page handler', () => {
  describe('GET requests', () => {
    it('should render blogPost.html template', () => {
      const res = { render: jest.fn() };

      handlers.BlogPost.get({ params: {} }, res);

      expect(res.render)
        .toHaveBeenCalledWith('admin/blogPost', { blogPost: null });
    });
  });

  describe('POST requests', () => {
    it('should construct a new BlogPostForm object', async () => {
      const req = { body: {}, params: {} };
      const res = { render: jest.fn() };

      await handlers.BlogPost.post(req, res);

      expect(forms.BlogPostForm).toHaveBeenCalledTimes(1);
      expect(forms.BlogPostForm).toHaveBeenCalledWith(req.body);
    });

    it('should display error message given invalid data', async () => {
      const req = { params: {} };
      const res = { render: jest.fn() };
      forms.BlogPostForm = jest.fn(() => ({
        isValid: () => false,
        error: 'Invalid form data',
      }));

      await handlers.BlogPost.post(req, res);

      expect(res.render).toHaveBeenCalledWith(
        'admin/blogPost',
        { errMessage: 'Invalid form data' },
      );
    });

    it('should create new blog post given valid data', async () => {
      const req = { params: {}, file: { filename: 'ocean.jpg' } };
      const res = { redirect: jest.fn() };
      const formObject = { isValid: () => true };
      forms.BlogPostForm = jest.fn(() => formObject);

      expect(database.createBlogPost).toHaveBeenCalledTimes(0);

      await handlers.BlogPost.post(req, res);

      expect(database.createBlogPost).toHaveBeenCalledTimes(1);
      expect(database.createBlogPost).toHaveBeenCalledWith(formObject);
    });
  });
});

describe('user overview page handler', () => {
  describe('GET requests', () => {
    it('should render userOverview.html template', async () => {
      const res = { render: jest.fn() };
      const users = [];
      const context = { users };
      database.getUsers = jest.fn(() => users);

      await handlers.userOverview.get({}, res);

      expect(res.render).toHaveBeenCalledWith('admin/userOverview', context);
    });
  });
});

describe('create user page handler', () => {
  describe('GET requests', () => {
    it('should render user.html template', () => {
      const res = { render: jest.fn() };

      handlers.createUser.get({}, res);

      expect(res.render).toHaveBeenCalledWith('admin/user');
    });
  });

  describe('POST requests', () => {
    it('should construct a new UserForm object', async () => {
      const req = {};
      const res = { render: jest.fn() };

      await handlers.createUser.post(req, res);

      expect(userForms.UserForm).toHaveBeenCalledTimes(1);
      expect(userForms.UserForm).toHaveBeenCalledWith(req.body);
    });

    it('should display error message given invalid data', async () => {
      const req = {};
      const res = { render: jest.fn() };
      const formObject = {
        isValid: () => false,
        error: 'Invalid form data',
      };
      userForms.UserForm = jest.fn(() => formObject);

      await handlers.createUser.post(req, res);

      expect(res.render).toHaveBeenCalledWith(
        'admin/user',
        { errMessage: 'Invalid form data' },
      );
    });

    it('should create new user given valid data', async () => {
      const req = {};
      const res = { redirect: jest.fn() };
      const formObject = { isValid: () => true };
      userForms.UserForm = jest.fn(() => formObject);

      expect(database.createUser).toHaveBeenCalledTimes(0);

      await handlers.createUser.post(req, res);

      expect(database.createUser).toHaveBeenCalledTimes(1);
      expect(database.createUser).toHaveBeenCalledWith(formObject);
    });
  });
});
