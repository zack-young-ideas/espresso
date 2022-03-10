const settings = require('../config');

exports.setupComplete = (req, res, next) => {
  /*
  Ensures that the steps required to set up the site are completed
  before any other pages can be viewed. The admin user must first enter
  the site's database login credentials. Then, they must create a
  username and password to use when accessing the admin site.
  */
  if (!settings.setup && !settings.databaseUri) {
    if (req.originalUrl === '/setup') {
      return next();
    }
    return res.redirect(302, '/setup');
  } if (!settings.setup && settings.databaseUri) {
    if (req.originalUrl === '/setup/user') {
      return next();
    }
    return res.redirect(302, '/setup/user');
  } if (req.originalUrl.startsWith('/setup')) {
    return res.status(404).render('public/404');
  }
  return next();
};

exports.adminRedirect = (req, res, next) => {
  /*
  If a user tries to view any part of the admin site and they are not
  authenticated, they will be redirected to the admin login page.
  */
  const userIsAdmin = Boolean(req.user?.admin);
  if (req.path !== '/admin/login') {
    if (req.path.startsWith('/admin') && !userIsAdmin) {
      return res.redirect(302, '/admin/login');
    }
  }
  return next();
};
