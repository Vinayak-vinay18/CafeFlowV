const express = require('express');
const router = express.Router();
const { login, getMe, forgotPassword, register } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/login', login);
router.post('/register', register);
router.post('/forgot-password', forgotPassword);
router.get('/me', protect, getMe);

module.exports = router;
