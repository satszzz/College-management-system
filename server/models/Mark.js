import mongoose from 'mongoose';

const markSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    internal: { type: Number, required: true },
    external: { type: Number, required: true },
    total: { type: Number, required: true },
    maxMarks: { type: Number, default: 150 },
    grade: { type: String, required: true },
    semester: { type: Number, required: true }
}, { timestamps: true });

export default mongoose.model('Mark', markSchema);
