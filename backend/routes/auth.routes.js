const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');

// -----------------------------
// Signup
// -----------------------------
router.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: 'User already exists' });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user (confirmed = false)
    const user = await User.create({ email, password: hashedPassword, confirmed: false });

    // Generate email confirmation token (expires in 1 day)
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    // Email setup
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email confirmation URL
    const confirmUrl = `${process.env.VITE_API_URL}/confirm/${token}`;

    // Send email
    await transporter.sendMail({
      from: `"Video App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Confirm your email',
      html: `<p>Welcome! Click <a href="${confirmUrl}">here</a> to confirm your email.</p>`
    });

    res.json({ msg: 'Signup successful! Check your email to confirm.' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error during signup' });
  }
});

// -----------------------------
// Confirm Email
// -----------------------------
router.get('/confirm/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.redirect(`${process.env.VITE_CLIENT_URL}/signin?error=invalid_token`);
    }

    user.confirmed = true;
    await user.save();

    // Redirect to SignIn page with query param
    return res.redirect(`${process.env.VITE_CLIENT_URL}/signin?confirmed=true`);
  } catch (err) {
    return res.redirect(`${process.env.VITE_CLIENT_URL}/signin?error=invalid_token`);
  }
});

// -----------------------------
// Signin
// -----------------------------
router.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    // Check if email is confirmed
    if (!user.confirmed) {
      return res.status(400).json({ msg: 'Please confirm your email before signing in' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({ msg: 'Signin successful', token });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error during signin' });
  }
});

module.exports = router;
