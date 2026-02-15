import mongoose from 'mongoose';

const feeSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    type: { type: String, required: true },
    amount: { type: Number, required: true },
    dueDate: { type: String, required: true },
    paidDate: { type: String, default: null },
    status: { type: String, enum: ['PAID', 'PENDING', 'OVERDUE'], default: 'PENDING' },
    semester: { type: Number, required: true }
}, { timestamps: true });

export default mongoose.model('Fee', feeSchema);
