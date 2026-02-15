import express from 'express';
import Course from '../models/Course.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// GET /api/courses
router.get('/', protect, async (req, res) => {
    try {
        const { department, semester, search, faculty } = req.query;
        const filter = {};
        if (department) filter.department = department;
        if (faculty) filter.faculty = faculty;
        if (semester) filter.semester = parseInt(semester);
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { code: { $regex: search, $options: 'i' } }
            ];
        }
        const courses = await Course.find(filter).sort({ code: 1 });
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/courses/:id
router.get('/:id', protect, async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ message: 'Course not found' });
        res.json(course);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/courses
router.post('/', protect, authorize('ADMIN'), async (req, res) => {
    try {
        const course = await Course.create(req.body);
        res.status(201).json(course);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Course code already exists' });
        }
        res.status(500).json({ message: error.message });
    }
});

// PUT /api/courses/:id
router.put('/:id', protect, authorize('ADMIN', 'FACULTY'), async (req, res) => {
    try {
        const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!course) return res.status(404).json({ message: 'Course not found' });
        res.json(course);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE /api/courses/:id
router.delete('/:id', protect, authorize('ADMIN'), async (req, res) => {
    try {
        const course = await Course.findByIdAndDelete(req.params.id);
        if (!course) return res.status(404).json({ message: 'Course not found' });
        res.json({ message: 'Course deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
