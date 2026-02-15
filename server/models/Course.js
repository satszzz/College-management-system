import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    credits: { type: Number, required: true },
    department: { type: String, required: true },
    semester: { type: Number, required: true },
    faculty: { type: String, required: true },
    description: { type: String, default: '' },
    enrolledStudents: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('Course', courseSchema);
