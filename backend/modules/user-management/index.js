const express = require('express');
const router = express.Router();
const userRoutes = require('./routes/user.routes');

// Mount routes
router.use('/', userRoutes);

module.exports = router;
