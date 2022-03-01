const express = require('express');

const handlers = require('./handlers');

const router = express.Router();

router.get('/', handlers.setupDatabase.get);
router.post('/', handlers.setupDatabase.post);
router.get('/user', handlers.setupUser.get);

module.exports = router;
