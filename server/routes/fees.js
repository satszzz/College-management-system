import express from 'express';
import Fee from '../models/Fee.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// GET /api/fees
router.get('/', protect, async (req, res) => {
    try {
        const { studentId, status, semester } = req.query;
        const filter = {};
        if (studentId) filter.studentId = studentId;
        if (status) filter.status = status;
        if (semester) filter.semester = parseInt(semester);
        const fees = await Fee.find(filter)
            .populate('studentId', 'name rollNumber')
            .sort({ dueDate: -1 });
        res.json(fees);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/fees/:id
router.get('/:id', protect, async (req, res) => {
    try {
        const fee = await Fee.findById(req.params.id).populate('studentId', 'name rollNumber');
        if (!fee) return res.status(404).json({ message: 'Fee not found' });
        res.json(fee);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/fees
router.post('/', protect, authorize('ADMIN'), async (req, res) => {
    try {
        const fee = await Fee.create(req.body);
        res.status(201).json(fee);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT /api/fees/:id (also used for paying)
router.put('/:id', protect, async (req, res) => {
    try {
        const fee = await Fee.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!fee) return res.status(404).json({ message: 'Fee not found' });
        res.json(fee);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE /api/fees/:id
router.delete('/:id', protect, authorize('ADMIN'), async (req, res) => {
    try {
        const fee = await Fee.findByIdAndDelete(req.params.id);
        if (!fee) return res.status(404).json({ message: 'Fee not found' });
        res.json({ message: 'Fee deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
