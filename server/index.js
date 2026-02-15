import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';

// Route imports
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import studentRoutes from './routes/students.js';
import courseRoutes from './routes/courses.js';
import markRoutes from './routes/marks.js';
import feeRoutes from './routes/fees.js';
import attendanceRoutes from './routes/attendance.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/marks', markRoutes);
app.use('/api/fees', feeRoutes);
app.use('/api/attendance', attendanceRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
const start = async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
        console.log(`📡 API endpoints ready at http://localhost:${PORT}/api`);
    });
};

start();
