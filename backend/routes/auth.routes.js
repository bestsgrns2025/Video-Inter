const express = require('express');
const router = express.Router();
const {
  signup,
  signin,
  forgotPassword,
  resetPassword,
  confirmYes,
  confirmNo,
  adminLogin,
  getUsers,
} = require('../controllers/auth.controller.js');

// Helper to wrap async controllers
const safe = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => {
    console.error('API Error:', err);
    res.status(500).json({ msg: 'Internal server error' });
  });
});

router.post('/signup', safe(signup));
router.post('/signin', safe(signin));
router.post('/forgot-password', safe(forgotPassword));
router.post('/reset-password/:token', safe(resetPassword));
router.get('/confirm/yes/:token', safe(confirmYes));
router.get('/confirm/no/:token', safe(confirmNo));
router.post('/admin/login', safe(adminLogin));
router.get('/users', safe(getUsers));

module.exports = router;
