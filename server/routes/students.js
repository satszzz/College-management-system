import express from 'express';
import Student from '../models/Student.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// GET /api/students
router.get('/', protect, async (req, res) => {
    try {
        const { department, semester, search, userId } = req.query;
        const filter = {};
        if (department) filter.department = department;
        if (userId) filter.userId = userId;
        if (semester) filter.semester = parseInt(semester);
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { rollNumber: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }
        const students = await Student.find(filter).sort({ name: 1 });
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/students/:id
router.get('/:id', protect, async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) return res.status(404).json({ message: 'Student not found' });
        res.json(student);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/students
router.post('/', protect, authorize('ADMIN'), async (req, res) => {
    try {
        const student = await Student.create(req.body);
        res.status(201).json(student);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Roll number already exists' });
        }
        res.status(500).json({ message: error.message });
    }
});

// PUT /api/students/:id
router.put('/:id', protect, authorize('ADMIN', 'FACULTY'), async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!student) return res.status(404).json({ message: 'Student not found' });
        res.json(student);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE /api/students/:id
router.delete('/:id', protect, authorize('ADMIN'), async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);
        if (!student) return res.status(404).json({ message: 'Student not found' });
        res.json({ message: 'Student deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
