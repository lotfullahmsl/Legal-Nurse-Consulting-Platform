const express = require('express');
const router = express.Router();
const searchController = require('../controllers/search.controller');
const { protect } = require('../../../shared/middleware/auth.middleware');

// Search routes
router.post('/medical-records', protect, searchController.searchRecords);
router.get('/suggestions', protect, searchController.getSuggestions);
router.get('/history', protect, searchController.getSearchHistory);

module.exports = router;
