import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['ADMIN', 'FACULTY', 'STUDENT', 'PARENT'], default: 'STUDENT' },
    phone: { type: String, default: '' },
    department: { type: String, default: '' },
    rollNumber: { type: String },
    semester: { type: Number },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
    avatar: { type: String, default: null }
}, { timestamps: true });

// Hash password before save
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 10);
});

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', userSchema);
