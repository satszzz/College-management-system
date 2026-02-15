import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rollNumber: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    department: { type: String, required: true },
    semester: { type: Number, required: true },
    phone: { type: String, default: '' },
    address: { type: String, default: '' },
    enrollmentYear: { type: Number, required: true }
}, { timestamps: true });

export default mongoose.model('Student', studentSchema);
