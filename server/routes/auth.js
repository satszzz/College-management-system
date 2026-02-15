import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        const userData = user.toObject();
        delete userData.password;

        res.json({
            success: true,
            token,
            user: userData,
            message: 'Login successful'
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email and password are required' });
        }

        const existing = await User.findOne({ email: email.toLowerCase() });
        if (existing) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        const user = await User.create({
            name,
            email: email.toLowerCase(),
            password,
            role: role || 'STUDENT'
        });

        res.status(201).json({
            success: true,
            message: 'Registration successful. Please login.'
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

export default router;
