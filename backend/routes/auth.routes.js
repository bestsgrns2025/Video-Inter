
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

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.get('/confirm/yes/:token', confirmYes);
router.get('/confirm/no/:token', confirmNo);
router.post('/admin/login', adminLogin);
router.get('/users', getUsers);

module.exports = router;
