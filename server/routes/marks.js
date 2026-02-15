import express from 'express';
import Mark from '../models/Mark.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// GET /api/marks
router.get('/', protect, async (req, res) => {
    try {
        const { studentId, courseId, semester } = req.query;
        const filter = {};
        if (studentId) filter.studentId = studentId;
        if (courseId) filter.courseId = courseId;
        if (semester) filter.semester = parseInt(semester);
        const marks = await Mark.find(filter)
            .populate('studentId', 'name rollNumber')
            .populate('courseId', 'name code')
            .sort({ createdAt: -1 });
        res.json(marks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/marks/:id
router.get('/:id', protect, async (req, res) => {
    try {
        const mark = await Mark.findById(req.params.id)
            .populate('studentId', 'name rollNumber')
            .populate('courseId', 'name code');
        if (!mark) return res.status(404).json({ message: 'Mark not found' });
        res.json(mark);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/marks
router.post('/', protect, authorize('ADMIN', 'FACULTY'), async (req, res) => {
    try {
        const mark = await Mark.create(req.body);
        res.status(201).json(mark);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT /api/marks/:id
router.put('/:id', protect, authorize('ADMIN', 'FACULTY'), async (req, res) => {
    try {
        const mark = await Mark.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!mark) return res.status(404).json({ message: 'Mark not found' });
        res.json(mark);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE /api/marks/:id
router.delete('/:id', protect, authorize('ADMIN'), async (req, res) => {
    try {
        const mark = await Mark.findByIdAndDelete(req.params.id);
        if (!mark) return res.status(404).json({ message: 'Mark not found' });
        res.json({ message: 'Mark deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
