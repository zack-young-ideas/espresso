const settings = require('../config');

exports.setupComplete = (req, res, next) => {
  if (!settings.databaseUri && (req.path !== '/setup')) {
    res.redirect(302, '/setup');
  } else {
    next();
  }
};
