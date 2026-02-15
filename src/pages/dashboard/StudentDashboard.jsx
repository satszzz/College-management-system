import { useState, useEffect } from 'react';
import { FiBook, FiAward, FiDollarSign, FiCalendar } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import './Dashboard.css';

const StudentDashboard = () => {
    const { user } = useAuth();
    const [studentData, setStudentData] = useState(null);
    const [marks, setMarks] = useState([]);
    const [fees, setFees] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Get student details linked to this user
                const { data: students } = await api.get(`/students?userId=${user.id}`);
                const student = students[0]; // Assuming one-to-one mapping

                if (student) {
                    setStudentData(student);

                    // 2. Fetch marks and fees for this student
                    const [marksRes, feesRes] = await Promise.all([
                        api.get(`/marks?studentId=${student._id}`),
                        api.get(`/fees?studentId=${student._id}`)
                    ]);

                    setMarks(marksRes.data);
                    setFees(feesRes.data);
                }
            } catch (err) {
                console.error('Failed to load student dashboard data', err);
            } finally {
                setLoading(false);
            }
        };

        if (user?.id) {
            fetchData();
        }
    }, [user]);

    if (loading) return <div className="dashboard"><SkeletonLoader type="card" count={4} /></div>;
    if (!studentData) return <div className="dashboard"><p>Student record not found. Please contact admin.</p></div>;

    const pendingFees = fees.filter(f => f.status !== 'PAID');

    // Calculate GPA (Simple average for now as credits might vary)
    const calculateGPA = () => {
        if (marks.length === 0) return 0;
        // Map grades to points
        const gradePoints = { 'A+': 10, 'A': 9, 'B+': 8, 'B': 7, 'C+': 6, 'C': 5, 'D': 4, 'F': 0 };
        const total = marks.reduce((sum, m) => sum + (gradePoints[m.grade] || 0), 0);
        return (total / marks.length).toFixed(2);
    };

    const statCards = [
        {
            icon: FiBook,
            label: 'Current Courses',
            value: marks.length > 0 ? marks.length : '0', // Approximation based on marks
            color: 'blue'
        },
        {
            icon: FiAward,
            label: 'Current GPA',
            value: calculateGPA(),
            color: 'green'
        },
        {
            icon: FiDollarSign,
            label: 'Pending Fees',
            value: `₹${pendingFees.reduce((sum, f) => sum + f.amount, 0).toLocaleString()}`,
            color: 'orange'
        },
        {
            icon: FiCalendar,
            label: 'Semester',
            value: `${studentData.semester}th`,
            color: 'purple'
        }
    ];

    const upcomingEvents = [
        { date: 'Feb 15', event: 'Mid-term Exams Begin', type: 'exam' },
        { date: 'Feb 28', event: 'Project Submission', type: 'deadline' },
        { date: 'Mar 10', event: 'Industry Visit', type: 'event' }
    ];

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <div>
                    <h1>Student Dashboard</h1>
                    <p>Welcome back, {studentData.name}!</p>
                </div>
            </div>

            <div className="stats-grid">
                {statCards.map((stat, index) => (
                    <div key={index} className={`stat-card ${stat.color}`}>
                        <div className="stat-icon">
                            <stat.icon size={24} />
                        </div>
                        <div className="stat-content">
                            <h3>{stat.value}</h3>
                            <p>{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="dashboard-grid">
                <div className="dashboard-card">
                    <div className="card-header">
                        <h2>Recent Marks</h2>
                        <button className="btn-link">View All</button>
                    </div>
                    <div className="marks-list">
                        {marks.length > 0 ? marks.slice(0, 4).map(mark => (
                            <div key={mark._id} className="mark-item">
                                <div className="mark-info">
                                    <h4>{mark.courseId?.name || 'Unknown Course'}</h4>
                                    <span className="course-code">{mark.courseId?.code}</span>
                                </div>
                                <div className="mark-score">
                                    <span className="score">{mark.total}</span>
                                    <span className={`grade grade-${mark.grade.replace('+', 'plus')}`}>
                                        {mark.grade}
                                    </span>
                                </div>
                            </div>
                        )) : <p className="no-data">No marks available</p>}
                    </div>
                </div>

                <div className="dashboard-card">
                    <div className="card-header">
                        <h2>Fee Status</h2>
                        <button className="btn-link">Pay Now</button>
                    </div>
                    <div className="fee-list">
                        {fees.length > 0 ? fees.slice(0, 4).map(fee => (
                            <div key={fee._id} className="fee-item-row">
                                <div className="fee-type">
                                    <h4>{fee.type}</h4>
                                    <span className="due-date">Due: {new Date(fee.dueDate).toLocaleDateString()}</span>
                                </div>
                                <div className="fee-amount">
                                    <span className="amount">₹{fee.amount.toLocaleString()}</span>
                                    <span className={`status-badge ${fee.status.toLowerCase()}`}>
                                        {fee.status}
                                    </span>
                                </div>
                            </div>
                        )) : <p className="no-data">No fee records found</p>}
                    </div>
                </div>

                <div className="dashboard-card">
                    <div className="card-header">
                        <h2>Upcoming Events</h2>
                    </div>
                    <div className="events-list">
                        {upcomingEvents.map((item, index) => (
                            <div key={index} className={`event-item ${item.type}`}>
                                <div className="event-date">{item.date}</div>
                                <div className="event-name">{item.event}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="dashboard-card performance-card">
                    <div className="card-header">
                        <h2>Performance Overview</h2>
                    </div>
                    <div className="performance-chart">
                        <div className="performance-ring">
                            <svg viewBox="0 0 36 36" className="circular-chart">
                                <path className="circle-bg"
                                    d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                                />
                                <path className="circle"
                                    strokeDasharray={`${calculateGPA() * 10}, 100`}
                                    d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                                />
                            </svg>
                            <div className="performance-value">{calculateGPA()} GPA</div>
                        </div>
                        <p>Overall Performance</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
