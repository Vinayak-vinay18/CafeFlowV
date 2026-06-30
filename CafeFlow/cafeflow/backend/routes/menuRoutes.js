const express = require('express');
const router = express.Router();
const {
  getMenuItems,
  getMenuItem,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getPopularityStats,
} = require('../controllers/menuController');
const { protect } = require('../middleware/authMiddleware');

router.get('/stats/popularity', protect, getPopularityStats);
router.route('/').get(getMenuItems).post(protect, createMenuItem);
router.route('/:id').get(getMenuItem).put(protect, updateMenuItem).delete(protect, deleteMenuItem);

module.exports = router;
