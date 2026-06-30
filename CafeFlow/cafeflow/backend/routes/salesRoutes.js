const express = require('express');
const router = express.Router();
const { getSalesAnalytics } = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getSalesAnalytics);

module.exports = router;
