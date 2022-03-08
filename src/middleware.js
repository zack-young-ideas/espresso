const settings = require('../config');

exports.setupComplete = (req, res, next) => {
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
