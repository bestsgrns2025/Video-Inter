const User = require('../models/User.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const validatePassword = (password) => {
    const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[A-Z]).{1,10}$/;
    return regex.test(password);
};

exports.signup = async (req, res) => {
    const { email, password } = req.body;

    if (!validatePassword(password)) {
        return res.status(400).json({ msg: 'Password must contain at least one special character, one capital letter, one number, and be a maximum of 10 characters long.' });
    }

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({
            email,
            password: hashedPassword,
        });

        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        const yesUrl = `http://localhost:5000/api/auth/confirm/yes/${token}`;
        const noUrl = `http://localhost:5000/api/auth/confirm/no/${token}`;

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Confirm your email',
            html: `
                <p>Welcome to Video Interview! Please confirm your email address.</p>
                <a href="${yesUrl}" style="background-color: #4CAF50; color: white; padding: 14px 25px; text-align: center; text-decoration: none; display: inline-block;">Yes, it's me</a>
                <a href="${noUrl}" style="background-color: #f44336; color: white; padding: 14px 25px; text-align: center; text-decoration: none; display: inline-block;">No, it's not me</a>
            `,
        });

        res.status(201).json({ msg: 'User created. Please check your email to confirm your account.' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Backend error');
    }
};

exports.signin = async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        if (!user.isVerified) {
            return res.status(400).json({ msg: 'Please confirm your email first' });
        }

        const payload = {
            user: {
                id: user.id,
            },
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: 3600 },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Backend error');
    }
};

exports.confirmYes = async (req, res) => {
    try {
        console.log('--- Confirm Yes Request Received ---');
        console.log('Token:', req.params.token);

        console.log('Verifying token...');
        const decoded = jwt.verify(req.params.token, process.env.JWT_SECRET);
        console.log('Token decoded successfully:', decoded);

        console.log('Updating user in database...');
        await User.findByIdAndUpdate(decoded.id, { isVerified: true });
        console.log('User updated successfully.');

        console.log('Redirecting to client...');
        res.redirect(`${process.env.CLIENT_URL}/email-confirmed`);
    } catch (err) {
        console.error('--- ERROR in Confirm Yes ---');
        console.error(err);
        res.status(400).send('Invalid token');
    }
};

exports.confirmNo = async (req, res) => {
    try {
        const decoded = jwt.verify(req.params.token, process.env.JWT_SECRET);
        await User.findByIdAndDelete(decoded.id);
        res.redirect(`${process.env.CLIENT_URL}/confirmation-rejected`);
    } catch (err) {
        console.error(err.message);
        res.status(400).send('Invalid token');
    }
};

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'User not found' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password reset',
            html: `Please click this link to reset your password: <a href="${resetUrl}">${resetUrl}</a>`,
        });

        res.json({ msg: 'Password reset link sent to your email' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Backend error');
    }
};

exports.resetPassword = async (req, res) => {
    const { password } = req.body;
    const token = req.params.token;

    if (!validatePassword(password)) {
        return res.status(400).json({ msg: 'Password must contain at least one special character, one capital letter, one number, and be a maximum of 10 characters long.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await User.findByIdAndUpdate(decoded.id, { password: hashedPassword });

        res.json({ msg: 'Password updated successfully' });

    } catch (err) {
        console.error(err.message);
        res.status(400).send('Invalid token');
    }
};