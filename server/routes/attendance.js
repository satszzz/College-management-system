import express from 'express';
import Attendance from '../models/Attendance.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// GET /api/attendance
router.get('/', protect, async (req, res) => {
    try {
        const { studentId, courseId, date, status } = req.query;
        const filter = {};
        if (studentId) filter.studentId = studentId;
        if (courseId) filter.courseId = courseId;
        if (date) filter.date = date;
        if (status) filter.status = status;
        const records = await Attendance.find(filter)
            .populate('studentId', 'name rollNumber')
            .populate('courseId', 'name code')
            .sort({ date: -1 });
        res.json(records);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/attendance
router.post('/', protect, authorize('ADMIN', 'FACULTY'), async (req, res) => {
    try {
        const record = await Attendance.create(req.body);
        res.status(201).json(record);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT /api/attendance/:id
router.put('/:id', protect, authorize('ADMIN', 'FACULTY'), async (req, res) => {
    try {
        const record = await Attendance.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!record) return res.status(404).json({ message: 'Record not found' });
        res.json(record);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE /api/attendance/:id
router.delete('/:id', protect, authorize('ADMIN'), async (req, res) => {
    try {
        const record = await Attendance.findByIdAndDelete(req.params.id);
        if (!record) return res.status(404).json({ message: 'Record not found' });
        res.json({ message: 'Attendance record deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
