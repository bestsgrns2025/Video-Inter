const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');

// Signup
router.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword, confirmed: false });

    // Generate token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    // Send confirmation email
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const confirmUrl = `${process.env.VITE_API_URL.replace('/api/auth','')}/confirm/${token}`;
    await transporter.sendMail({
      from: `"Video App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Confirm your email',
      html: `<p>Click <a href="${confirmUrl}">here</a> to confirm your email.</p>`
    });

    res.json({ msg: 'Signup successful! Check your email to confirm.' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Confirm email
router.get('/confirm/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(400).send('Invalid token');

    user.confirmed = true;
    await user.save();
    res.send('✅ Email confirmed! You can now login.');
  } catch (err) {
    res.status(400).send('Invalid or expired token');
  }
});

module.exports = router;
