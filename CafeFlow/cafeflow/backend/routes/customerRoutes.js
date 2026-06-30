const express = require('express');
const router = express.Router();
const {
  getCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getTopCustomers,
} = require('../controllers/customerController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.get('/top/list', getTopCustomers);
router.route('/').get(getCustomers).post(createCustomer);
router.route('/:id').get(getCustomer).put(updateCustomer).delete(deleteCustomer);

module.exports = router;
