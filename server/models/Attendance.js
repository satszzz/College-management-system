import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    date: { type: String, required: true },
    status: { type: String, enum: ['PRESENT', 'ABSENT', 'LATE'], default: 'PRESENT' }
}, { timestamps: true });

export default mongoose.model('Attendance', attendanceSchema);
