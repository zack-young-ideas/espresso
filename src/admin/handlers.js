const handlers = {};

handlers.homepage = {

  get: (req, res) => {
    res.render('admin/homepage');
  },

};

module.exports = handlers;
