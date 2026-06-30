const express = require('express');
const router = express.Router();
const {
  getOrders,
  getOrder,
  createOrder,
  updateOrderStatus,
  deleteOrder,
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.route('/').get(getOrders).post(createOrder);
router.route('/:id').get(getOrder).delete(deleteOrder);
router.put('/:id/status', updateOrderStatus);

module.exports = router;
