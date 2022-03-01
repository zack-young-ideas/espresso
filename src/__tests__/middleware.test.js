const middleware = require('../middleware');
const settings = require('../../config');

jest.mock('../../config');

describe('Setup middleware', () => {
  it('should redirect requests if database is not initialized', () => {
    const req = { path: '/not-setup' };
    const res = { redirect: jest.fn() };
    const next = jest.fn();
    settings.databaseUri = undefined;

    expect(res.redirect).toHaveBeenCalledTimes(0);

    middleware.setupComplete(req, res, next);

    expect(res.redirect).toHaveBeenCalledTimes(1);
    expect(res.redirect).toHaveBeenCalledWith(302, '/setup');
    expect(next).toHaveBeenCalledTimes(0);

    settings.databaseUri = 'connection';

    middleware.setupComplete(req, res, next);

    expect(res.redirect).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledTimes(1);
  });
});
