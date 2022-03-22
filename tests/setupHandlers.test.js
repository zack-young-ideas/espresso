const database = require('../lib/database');
const forms = require('../lib/setup/forms');
const handlers = require('../lib/setup/handlers');
const settings = require('../config');

jest.mock('../config');
jest.mock('../lib/database');
jest.mock('../lib/setup/forms');

describe('setupDatabase handler', () => {
  describe('GET requests', () => {
    it('should render database.html template', () => {
      const res = { render: jest.fn() };

      handlers.setupDatabase.get({}, res);

      expect(res.render).toHaveBeenCalledWith('setup/database');
    });
  });

  describe('POST requests', () => {
    it('should create a new form object', async () => {
      const req = { body: {} };
      const res = { render: jest.fn() };

      await handlers.setupDatabase.post(req, res);

      expect(forms.DatabaseForm).toHaveBeenCalledTimes(1);
      expect(forms.DatabaseForm).toHaveBeenCalledWith(req.body);
    });

    it('should display error message given invalid data', async () => {
      const req = {};
      const res = { render: jest.fn() };
      forms.DatabaseForm = jest.fn(() => ({
        isValid: () => false,
        error: 'Invalid host name',
      }));

      await handlers.setupDatabase.post(req, res);

      expect(res.render).toHaveBeenCalledWith(
        'setup/database',
        { errMessage: 'Invalid host name' },
      );
    });

    it('should connect to database given valid data', async () => {
      const req = {};
      const res = { redirect: jest.fn() };
      const formObject = { isValid: () => true };
      forms.DatabaseForm = jest.fn(() => formObject);

      expect(database.connect).toHaveBeenCalledTimes(0);

      await handlers.setupDatabase.post(req, res);

      expect(database.connect).toHaveBeenCalledTimes(1);
      expect(database.connect).toHaveBeenCalledWith(formObject);
    });

    it('should update settings given valid data', async () => {
      const req = {};
      const res = { redirect: jest.fn() };
      const formObject = { isValid: () => true };
      forms.DatabaseForm = jest.fn(() => formObject);
      settings.updateDatabase.mockClear();

      expect(settings.updateDatabase).toHaveBeenCalledTimes(0);

      await handlers.setupDatabase.post(req, res);

      expect(settings.updateDatabase).toHaveBeenCalledTimes(1);
      expect(settings.updateDatabase).toHaveBeenCalledWith(formObject);
    });

    it('should redirect given valid data', async () => {
      const req = {};
      const res = { redirect: jest.fn() };
      const formObject = { isValid: () => true };
      forms.DatabaseForm = jest.fn(() => formObject);

      expect(res.redirect).toHaveBeenCalledTimes(0);

      await handlers.setupDatabase.post(req, res);

      expect(res.redirect).toHaveBeenCalledTimes(1);
      expect(res.redirect).toHaveBeenCalledWith(303, '/setup/user');
    });
  });
});

describe('setupUser handler', () => {
  describe('GET requests', () => {
    it('should render user.html template', () => {
      const res = { render: jest.fn() };

      handlers.setupUser.get({}, res);

      expect(res.render).toHaveBeenCalledWith('setup/user');
    });
  });

  describe('POST requests', () => {
    it('should create a new form object', async () => {
      const req = { body: {} };
      const res = { render: jest.fn() };

      await handlers.setupUser.post(req, res);

      expect(forms.UserForm).toHaveBeenCalledTimes(1);
      expect(forms.UserForm).toHaveBeenCalledWith({
        firstName: 'Admin',
        lastName: '',
        role: 'admin',
      });
    });

    it('should display error message given invalid data', async () => {
      const req = {};
      const res = { render: jest.fn() };
      forms.UserForm = jest.fn(() => ({
        isValid: () => false,
        error: 'Invalid email',
      }));

      await handlers.setupUser.post(req, res);

      expect(res.render).toHaveBeenCalledWith(
        'setup/user',
        { errMessage: 'Invalid email' },
      );
    });

    it('should create admin user given valid data', async () => {
      const req = { login: jest.fn() };
      const res = { redirect: jest.fn() };
      const formObject = { isValid: () => true };
      forms.UserForm = jest.fn(() => formObject);

      expect(database.createUser).toHaveBeenCalledTimes(0);

      await handlers.setupUser.post(req, res);

      expect(database.createUser).toHaveBeenCalledTimes(1);
      expect(database.createUser).toHaveBeenCalledWith(formObject);
    });

    it('should update settings given valid data', async () => {
      const req = { login: jest.fn() };
      const res = { redirect: jest.fn() };
      const formObject = { isValid: () => true };
      forms.UserForm = jest.fn(() => formObject);
      settings.completeSetup.mockClear();

      expect(settings.completeSetup).toHaveBeenCalledTimes(0);

      await handlers.setupUser.post(req, res);

      expect(settings.completeSetup).toHaveBeenCalledTimes(1);
      expect(settings.completeSetup).toHaveBeenCalledWith();
    });

    it('should log in new admin user given valid data', async () => {
      const req = { login: jest.fn() };
      const res = { redirect: jest.fn() };
      const formObject = { isValid: () => true };
      forms.UserForm = jest.fn(() => formObject);
      const userObject = {};
      database.createUser = jest.fn(() => userObject);

      expect(req.login).toHaveBeenCalledTimes(0);

      await handlers.setupUser.post(req, res);

      expect(req.login).toHaveBeenCalledTimes(1);
      expect(req.login.mock.calls[0][0]).toBe(userObject);
    });

    it('should send 500 response on error', async () => {
      const req = {};
      const responseObject = { render: jest.fn() };
      const res = { status: jest.fn(() => responseObject) };
      const formObject = { isValid: () => true };
      forms.UserForm = jest.fn(() => formObject);
      database.createUser = jest.fn(() => {
        throw new Error();
      });

      expect(res.status).toHaveBeenCalledTimes(0);

      await handlers.setupUser.post(req, res);

      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(responseObject.render).toHaveBeenCalledTimes(1);
      expect(responseObject.render).toHaveBeenCalledWith('public/500');
    });
  });
});
