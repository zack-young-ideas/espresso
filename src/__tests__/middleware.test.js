const middleware = require('../middleware');
const settings = require('../../config');

jest.mock('../../config');

describe('Setup middleware', () => {
  it('should redirect requests if database is not initialized', () => {
    const req = { path: '/not-setup' };
    const res = { redirect: jest.fn() };
    const next = jest.fn();
    settings.setup = undefined;
    settings.databaseUri = undefined;

    expect(res.redirect).toHaveBeenCalledTimes(0);

    middleware.setupComplete(req, res, next);

    expect(res.redirect).toHaveBeenCalledTimes(1);
    expect(res.redirect).toHaveBeenCalledWith(302, '/setup');
  });

  it('should redirect requests if admin user is not created', () => {
    const req = { path: '/not-setup' };
    const res = { redirect: jest.fn() };
    const next = jest.fn();
    settings.setup = undefined;
    settings.databaseUri = 'connection';

    expect(res.redirect).toHaveBeenCalledTimes(0);

    middleware.setupComplete(req, res, next);

    expect(res.redirect).toHaveBeenCalledTimes(1);
    expect(res.redirect).toHaveBeenCalledWith(302, '/setup/user');
  });

  it('should return 404 response if setup is complete', () => {
    const req = { originalUrl: '/setup' };
    const returnObject = { render: jest.fn() };
    const res = {
      redirect: jest.fn(),
      status: jest.fn(() => returnObject),
    };
    const next = jest.fn();
    settings.setup = true;
    settings.databaseUri = 'connection';

    expect(res.status).toHaveBeenCalledTimes(0);
   
    middleware.setupComplete(req, res, next);

    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(returnObject.render).toHaveBeenCalledTimes(1);
    expect(returnObject.render).toHaveBeenCalledWith('public/404');
  });
});
