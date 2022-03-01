const database = require('../database');
const forms = require('./forms');
const settings = require('../../config');

const handlers = {};

handlers.setupDatabase = {

  get: (req, res) => {
    res.render('setup/database');
  },

  post: async (req, res) => {
    const form = new forms.DatabaseForm(req.body);
    if (form.isValid()) {
      try {
        await database.connect(form);
        await settings.updateDatabase(form);
        res.redirect(303, '/setup/user');
      } catch (error) {
        if (error.codeName === 'AuthenticationFailed') {
          res.render(
            'setup/database',
            { errMessage: 'Invalid username or password' },
          );
        } else {
          res.status(500).send('Internal server error');
        }
      }
    } else {
      res.render('setup/database', { errMessage: form.error });
    }
  },

};
handlers.setupUser = {

  get: (req, res) => {
    res.render('setup/user');
  },

};

module.exports = handlers;
