const express = require('express');
const router = express.Router();
const {
    signup: signupController,
    signin: signinController,
    forgotPassword: forgotPasswordController,
    resetPassword: resetPasswordController,
    confirmYes: confirmYesController,
    confirmNo: confirmNoController,
    adminLogin: adminLoginController,
    getUsers: getUsersController,
} = require('../controllers/auth.controller.js');

router.post('/signup', async (req, res) => {
  try {
    await signupController(req, res);
  } catch (err) {
    console.error('Signup Error:', err);
    res.status(500).json({ msg: 'Internal server error' });
  }
});

router.post('/signin', async (req, res) => {
  try {
    await signinController(req, res);
  } catch (err) {
    console.error('Signin Error:', err);
    res.status(500).json({ msg: 'Internal server error' });
  }
});

router.post('/forgot-password', async (req, res) => {
  try {
    await forgotPasswordController(req, res);
  } catch (err) {
    console.error('Forgot Password Error:', err);
    res.status(500).json({ msg: 'Internal server error' });
  }
});

router.post('/reset-password/:token', async (req, res) => {
  try {
    await resetPasswordController(req, res);
  } catch (err) {
    console.error('Reset Password Error:', err);
    res.status(500).json({ msg: 'Internal server error' });
  }
});

router.get('/confirm/yes/:token', async (req, res) => {
  try {
    await confirmYesController(req, res);
  } catch (err) {
    console.error('Confirm Yes Error:', err);
    res.status(500).json({ msg: 'Internal server error' });
  }
});

router.get('/confirm/no/:token', async (req, res) => {
  try {
    await confirmNoController(req, res);
  } catch (err) {
    console.error('Confirm No Error:', err);
    res.status(500).json({ msg: 'Internal server error' });
  }
});

router.post('/admin/login', async (req, res) => {
  try {
    await adminLoginController(req, res);
  } catch (err) {
    console.error('Admin Login Error:', err);
    res.status(500).json({ msg: 'Internal server error' });
  }
});

router.get('/users', async (req, res) => {
  try {
    await getUsersController(req, res);
  } catch (err) {
    console.error('Get Users Error:', err);
    res.status(500).json({ msg: 'Internal server error' });
  }
});

module.exports = router;
