import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Student from '../models/Student.js';

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
            process.env.JWT_SECRET || 'college_mng_secret_7788_satszzz',
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

        if (user.role === 'STUDENT') {
            const count = await Student.countDocuments();
            const rollNumber = `CS2026${String(count + 1).padStart(3, '0')}`;
            const studentDoc = await Student.create({
                userId: user._id,
                rollNumber,
                name: user.name,
                email: user.email,
                department: user.department || 'Computer Science',
                semester: user.semester || 1,
                enrollmentYear: new Date().getFullYear()
            });
            user.studentId = studentDoc._id;
            await user.save();
        }

        res.status(201).json({
            success: true,
            message: 'Registration successful. Please login.'
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

export default router;
