const express = require('express');

const handlers = require('./handlers');

const router = express.Router();

router.get('/', handlers.homepage.get);

module.exports = router;
