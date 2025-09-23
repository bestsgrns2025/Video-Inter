
const express = require('express');
const router = express.Router();
const {
    signup,
    signin,
    forgotPassword,
    resetPassword,
    confirmYes,
    confirmNo,
} = require('../controllers/auth.controller');

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.get('/confirm/yes/:token', confirmYes);
router.get('/confirm/no/:token', confirmNo);

module.exports = router;
