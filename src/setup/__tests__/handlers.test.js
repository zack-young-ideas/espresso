const database = require('../../database');
const forms = require('../forms');
const handlers = require('../handlers');
const settings = require('../../../config');


jest.mock('../../../config');
jest.mock('../../database');
jest.mock('../forms');

describe('setupDatabase handler', () => {

  describe('GET requests', () => {
    it('should render database.html template', () => {
      const res = {render: jest.fn()};

      handlers.setupDatabase.get({}, res);

      expect(res.render.mock.calls[0][0]).toBe('setup/database');
    });
  });

  describe('POST requests', () => {
    it('should create a new Form object', async () => {
      const req = {body: {}};
      const res = {render: jest.fn()};

      await handlers.setupDatabase.post(req, res);

      expect(forms.DatabaseForm).toHaveBeenCalledTimes(1);
      expect(forms.DatabaseForm).toHaveBeenCalledWith(req.body);
    });

    it('should display error message given invalid data', async () => {
      const req = {};
      const res = {render: jest.fn()};
      forms.DatabaseForm = jest.fn(() => {
        return {
          isValid: () => false,
          error: 'Invalid host name',
        }
      });

      await handlers.setupDatabase.post(req, res);

      expect(res.render).toHaveBeenCalledWith(
        'setup/database',
        {errMessage: 'Invalid host name'}
      );
    });

    it('should connect to database given valid data', async () => {
      const req = {};
      const res = {redirect: jest.fn()};
      const formObject = {isValid: () => true};
      forms.DatabaseForm = jest.fn(() => formObject);

      expect(database.connect).toHaveBeenCalledTimes(0);

      await handlers.setupDatabase.post(req, res);

      expect(database.connect).toHaveBeenCalledTimes(1);
      expect(database.connect).toHaveBeenCalledWith(formObject);
    });

    it('should update settings given valid data', async () => {
      const req = {};
      const res = {redirect: jest.fn()};
      const formObject = {isValid: () => true};
      forms.DatabaseForm = jest.fn(() => formObject);
      settings.updateDatabase.mockClear();

      expect(settings.updateDatabase).toHaveBeenCalledTimes(0);

      await handlers.setupDatabase.post(req, res);

      expect(settings.updateDatabase).toHaveBeenCalledTimes(1);
      expect(settings.updateDatabase).toHaveBeenCalledWith(formObject);
    });

    it('should redirect given valid data', async () => {
      const req = {};
      const res = {redirect: jest.fn()};
      const formObject = {isValid: () => true};
      forms.DatabaseForm = jest.fn(() => formObject);

      expect(res.redirect).toHaveBeenCalledTimes(0);

      await handlers.setupDatabase.post(req, res);

      expect(res.redirect).toHaveBeenCalledTimes(1);
      expect(res.redirect).toHaveBeenCalledWith(303, '/setup/user');
    });
  });
 
});

describe('setupUser handler', () => {
  it('should render user template on GET requests', () => {
    const res = {render: jest.fn()};

    handlers.setupUser.get({}, res);

    expect(res.render.mock.calls[0][0]).toBe('setup/user');
  });
});
