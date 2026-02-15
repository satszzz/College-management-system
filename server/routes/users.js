import express from 'express';
import User from '../models/User.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// GET /api/users — list all users (Admin only)
router.get('/', protect, authorize('ADMIN'), async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/users/:id
router.get('/:id', protect, async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/users — create user (Admin only)
router.post('/', protect, authorize('ADMIN'), async (req, res) => {
    try {
        const user = await User.create(req.body);
        const userData = user.toObject();
        delete userData.password;
        res.status(201).json(userData);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        res.status(500).json({ message: error.message });
    }
});

// PUT /api/users/:id
router.put('/:id', protect, async (req, res) => {
    try {
        // Only admin or the user themselves can update
        if (req.user.role !== 'ADMIN' && req.user._id.toString() !== req.params.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE /api/users/:id (Admin only)
router.delete('/:id', protect, authorize('ADMIN'), async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
