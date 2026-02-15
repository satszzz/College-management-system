import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import User from './models/User.js';
import Student from './models/Student.js';
import Course from './models/Course.js';
import Mark from './models/Mark.js';
import Fee from './models/Fee.js';
import Attendance from './models/Attendance.js';

const seedData = async () => {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Student.deleteMany({});
    await Course.deleteMany({});
    await Mark.deleteMany({});
    await Fee.deleteMany({});
    await Attendance.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // ─── USERS ───
    const users = await User.create([
        { name: 'Admin User', email: 'admin@college.edu', password: 'admin123', role: 'ADMIN', phone: '9876543210', department: 'Administration' },
        { name: 'Dr. Rajesh Kumar', email: 'faculty@college.edu', password: 'faculty123', role: 'FACULTY', phone: '9876543211', department: 'Computer Science' },
        { name: 'Amit Sharma', email: 'student@college.edu', password: 'student123', role: 'STUDENT', phone: '9876543212', department: 'Computer Science' },
        { name: 'Ramesh Sharma', email: 'parent@college.edu', password: 'parent123', role: 'PARENT', phone: '9876543213' },
        { name: 'Priya Patel', email: 'priya@college.edu', password: 'student123', role: 'STUDENT', phone: '9876543214', department: 'Information Technology' },
        { name: 'Rahul Verma', email: 'rahul@college.edu', password: 'student123', role: 'STUDENT', phone: '9876543215', department: 'Computer Science' },
        { name: 'Sneha Gupta', email: 'sneha@college.edu', password: 'student123', role: 'STUDENT', phone: '9876543216', department: 'Electronics' },
        { name: 'Dr. Meena Singh', email: 'meena@college.edu', password: 'faculty123', role: 'FACULTY', phone: '9876543217', department: 'Mathematics' }
    ]);
    console.log(`👤 Created ${users.length} users`);

    // ─── STUDENTS ───
    const studentUser1 = users.find(u => u.email === 'student@college.edu');
    const studentUser2 = users.find(u => u.email === 'priya@college.edu');
    const studentUser3 = users.find(u => u.email === 'rahul@college.edu');
    const studentUser4 = users.find(u => u.email === 'sneha@college.edu');

    const students = await Student.create([
        { userId: studentUser1._id, rollNumber: 'CS2021001', name: 'Amit Sharma', email: 'student@college.edu', department: 'Computer Science', semester: 6, phone: '9876543212', address: 'Mumbai, Maharashtra', enrollmentYear: 2021 },
        { userId: studentUser2._id, rollNumber: 'IT2021002', name: 'Priya Patel', email: 'priya@college.edu', department: 'Information Technology', semester: 6, phone: '9876543214', address: 'Delhi, India', enrollmentYear: 2021 },
        { userId: studentUser3._id, rollNumber: 'CS2021003', name: 'Rahul Verma', email: 'rahul@college.edu', department: 'Computer Science', semester: 4, phone: '9876543215', address: 'Bangalore, Karnataka', enrollmentYear: 2022 },
        { userId: studentUser4._id, rollNumber: 'EC2022004', name: 'Sneha Gupta', email: 'sneha@college.edu', department: 'Electronics', semester: 4, phone: '9876543216', address: 'Pune, Maharashtra', enrollmentYear: 2022 },
        { rollNumber: 'CS2022005', name: 'Vikram Singh', email: 'vikram@college.edu', department: 'Computer Science', semester: 2, phone: '9876543218', address: 'Chennai, Tamil Nadu', enrollmentYear: 2023 },
        { rollNumber: 'IT2023006', name: 'Ananya Reddy', email: 'ananya@college.edu', department: 'Information Technology', semester: 2, phone: '9876543219', address: 'Hyderabad, Telangana', enrollmentYear: 2023 }
    ]);
    console.log(`🎓 Created ${students.length} students`);

    // Link parent to student
    const parentUser = users.find(u => u.email === 'parent@college.edu');
    parentUser.studentId = students[0]._id;
    await parentUser.save();

    // ─── COURSES ───
    const courses = await Course.create([
        { code: 'CS301', name: 'Data Structures & Algorithms', credits: 4, department: 'Computer Science', semester: 3, faculty: 'Dr. Rajesh Kumar', description: 'Study of fundamental data structures and algorithmic techniques', enrolledStudents: 45 },
        { code: 'CS302', name: 'Database Management Systems', credits: 4, department: 'Computer Science', semester: 3, faculty: 'Dr. Rajesh Kumar', description: 'Relational databases, SQL, and query optimization', enrolledStudents: 42 },
        { code: 'CS401', name: 'Machine Learning', credits: 3, department: 'Computer Science', semester: 5, faculty: 'Dr. Rajesh Kumar', description: 'Introduction to supervised and unsupervised learning', enrolledStudents: 38 },
        { code: 'IT301', name: 'Web Development', credits: 3, department: 'Information Technology', semester: 3, faculty: 'Dr. Meena Singh', description: 'Full-stack web development with modern frameworks', enrolledStudents: 50 },
        { code: 'MA201', name: 'Discrete Mathematics', credits: 3, department: 'Mathematics', semester: 2, faculty: 'Dr. Meena Singh', description: 'Logic, sets, combinatorics, and graph theory', enrolledStudents: 55 },
        { code: 'EC201', name: 'Digital Electronics', credits: 4, department: 'Electronics', semester: 2, faculty: 'Dr. Rajesh Kumar', description: 'Combinational and sequential logic circuits', enrolledStudents: 40 },
        { code: 'CS501', name: 'Computer Networks', credits: 4, department: 'Computer Science', semester: 5, faculty: 'Dr. Rajesh Kumar', description: 'OSI model, TCP/IP, routing, and network security', enrolledStudents: 35 }
    ]);
    console.log(`📚 Created ${courses.length} courses`);

    // ─── MARKS ───
    const marksData = [
        { studentId: students[0]._id, courseId: courses[0]._id, internal: 38, external: 85, total: 123, maxMarks: 150, grade: 'A', semester: 6 },
        { studentId: students[0]._id, courseId: courses[1]._id, internal: 42, external: 78, total: 120, maxMarks: 150, grade: 'A', semester: 6 },
        { studentId: students[0]._id, courseId: courses[2]._id, internal: 35, external: 62, total: 97, maxMarks: 150, grade: 'B+', semester: 6 },
        { studentId: students[1]._id, courseId: courses[0]._id, internal: 45, external: 90, total: 135, maxMarks: 150, grade: 'A+', semester: 6 },
        { studentId: students[1]._id, courseId: courses[3]._id, internal: 40, external: 72, total: 112, maxMarks: 150, grade: 'B+', semester: 6 },
        { studentId: students[2]._id, courseId: courses[0]._id, internal: 30, external: 55, total: 85, maxMarks: 150, grade: 'B', semester: 4 },
        { studentId: students[2]._id, courseId: courses[1]._id, internal: 25, external: 48, total: 73, maxMarks: 150, grade: 'C+', semester: 4 },
        { studentId: students[3]._id, courseId: courses[5]._id, internal: 40, external: 82, total: 122, maxMarks: 150, grade: 'A', semester: 4 },
        { studentId: students[4]._id, courseId: courses[4]._id, internal: 35, external: 70, total: 105, maxMarks: 150, grade: 'B+', semester: 2 },
        { studentId: students[5]._id, courseId: courses[3]._id, internal: 28, external: 60, total: 88, maxMarks: 150, grade: 'B', semester: 2 }
    ];
    const marks = await Mark.create(marksData);
    console.log(`📊 Created ${marks.length} marks`);

    // ─── FEES ───
    const feesData = [
        { studentId: students[0]._id, type: 'Tuition Fee', amount: 75000, dueDate: '2024-01-15', paidDate: '2024-01-10', status: 'PAID', semester: 6 },
        { studentId: students[0]._id, type: 'Library Fee', amount: 5000, dueDate: '2024-01-15', paidDate: '2024-01-12', status: 'PAID', semester: 6 },
        { studentId: students[0]._id, type: 'Lab Fee', amount: 15000, dueDate: '2024-02-28', status: 'PENDING', semester: 6 },
        { studentId: students[1]._id, type: 'Tuition Fee', amount: 75000, dueDate: '2024-01-15', paidDate: '2024-01-14', status: 'PAID', semester: 6 },
        { studentId: students[1]._id, type: 'Hostel Fee', amount: 45000, dueDate: '2024-01-20', status: 'OVERDUE', semester: 6 },
        { studentId: students[2]._id, type: 'Tuition Fee', amount: 75000, dueDate: '2024-01-15', status: 'PENDING', semester: 4 },
        { studentId: students[2]._id, type: 'Exam Fee', amount: 3000, dueDate: '2024-03-01', status: 'PENDING', semester: 4 },
        { studentId: students[3]._id, type: 'Tuition Fee', amount: 80000, dueDate: '2024-01-15', paidDate: '2024-01-08', status: 'PAID', semester: 4 },
        { studentId: students[4]._id, type: 'Tuition Fee', amount: 75000, dueDate: '2024-01-15', status: 'OVERDUE', semester: 2 },
        { studentId: students[5]._id, type: 'Tuition Fee', amount: 75000, dueDate: '2024-01-15', paidDate: '2024-01-15', status: 'PAID', semester: 2 }
    ];
    const fees = await Fee.create(feesData);
    console.log(`💰 Created ${fees.length} fees`);

    // ─── ATTENDANCE ───
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const attendanceData = [
        { studentId: students[0]._id, courseId: courses[0]._id, date: today, status: 'PRESENT' },
        { studentId: students[0]._id, courseId: courses[1]._id, date: today, status: 'PRESENT' },
        { studentId: students[1]._id, courseId: courses[0]._id, date: today, status: 'LATE' },
        { studentId: students[1]._id, courseId: courses[3]._id, date: today, status: 'PRESENT' },
        { studentId: students[2]._id, courseId: courses[0]._id, date: today, status: 'ABSENT' },
        { studentId: students[3]._id, courseId: courses[5]._id, date: today, status: 'PRESENT' },
        { studentId: students[4]._id, courseId: courses[4]._id, date: today, status: 'PRESENT' },
        { studentId: students[5]._id, courseId: courses[3]._id, date: today, status: 'LATE' },
        { studentId: students[0]._id, courseId: courses[0]._id, date: yesterday, status: 'PRESENT' },
        { studentId: students[1]._id, courseId: courses[0]._id, date: yesterday, status: 'PRESENT' },
        { studentId: students[2]._id, courseId: courses[0]._id, date: yesterday, status: 'PRESENT' },
        { studentId: students[3]._id, courseId: courses[5]._id, date: yesterday, status: 'ABSENT' },
    ];
    const attendance = await Attendance.create(attendanceData);
    console.log(`📋 Created ${attendance.length} attendance records`);

    console.log('\n✅ Database seeded successfully!');
    console.log('📌 Login credentials:');
    console.log('   Admin:   admin@college.edu / admin123');
    console.log('   Faculty: faculty@college.edu / faculty123');
    console.log('   Student: student@college.edu / student123');
    console.log('   Parent:  parent@college.edu / parent123');

    process.exit(0);
};

seedData().catch(err => {
    console.error('❌ Seed failed:', err);
    process.exit(1);
});
