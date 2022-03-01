/**
 * Top-level script to initialize and configure web application object.
 */

const path = require('path');

const express = require('express');
const expressNunjucks = require('express-nunjucks');

const app = express();
const port = 3000;

// Serve static files.
app.use('/static', express.static('static'));

// Configure the Nunjucks template engine.
app.set('views', path.join(__dirname, '/templates'));
expressNunjucks(app, { noCache: true });

app.get('/', (req, res) => {
  res.render('public/homepage');
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Listening on port ${port}...`); // eslint-disable-line
  });
} else {
  module.exports = app;
}
