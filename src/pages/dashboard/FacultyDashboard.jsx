import { useState, useEffect } from 'react';
import { FiBook, FiUsers, FiEdit, FiClock } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import './Dashboard.css';

const FacultyDashboard = () => {
    const { user } = useAuth();
    const [courses, setCourses] = useState([]);
    const [stats, setStats] = useState({
        assignedCourses: 0,
        totalStudents: 0,
        pendingGrades: 0,
        upcomingClasses: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch courses for this faculty
                const { data } = await api.get(`/courses?faculty=${user.name}`);
                setCourses(data);

                // Calculate stats
                const totalStudents = data.reduce((sum, course) => sum + (course.enrolledStudents || 0), 0);

                setStats({
                    assignedCourses: data.length,
                    totalStudents,
                    pendingGrades: 12, // Mock for now
                    upcomingClasses: 3 // Mock for now
                });
            } catch (err) {
                console.error('Failed to load faculty dashboard', err);
            } finally {
                setLoading(false);
            }
        };

        if (user?.name) {
            fetchDashboardData();
        }
    }, [user]);

    if (loading) return <div className="dashboard"><SkeletonLoader type="card" count={4} /></div>;

    const statCards = [
        {
            icon: FiBook,
            label: 'Assigned Courses',
            value: stats.assignedCourses,
            color: 'purple'
        },
        {
            icon: FiUsers,
            label: 'Total Students',
            value: stats.totalStudents,
            color: 'blue'
        },
        {
            icon: FiEdit,
            label: 'Pending Grades',
            value: stats.pendingGrades,
            color: 'orange'
        },
        {
            icon: FiClock,
            label: 'Upcoming Classes',
            value: stats.upcomingClasses,
            color: 'green'
        }
    ];

    const schedule = [
        { time: '09:00 AM', course: 'Data Structures', room: 'Room 201', students: 45 },
        { time: '11:00 AM', course: 'Web Development', room: 'Lab 3', students: 38 },
        { time: '02:00 PM', course: 'Machine Learning', room: 'Room 105', students: 52 }
    ];

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <div>
                    <h1>Faculty Dashboard</h1>
                    <p>Welcome, Prof. {user.name}!</p>
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
                        <h2>My Courses</h2>
                        <button className="btn-link">View All</button>
                    </div>
                    <div className="course-list">
                        {courses.length > 0 ? courses.map(course => (
                            <div key={course._id} className="course-item">
                                <div className="course-info">
                                    <h4>{course.name}</h4>
                                    <span className="course-code">{course.code}</span>
                                </div>
                                <div className="course-meta">
                                    <span className="credits">{course.credits} Credits</span>
                                    <span className="semester">Sem {course.semester}</span>
                                </div>
                            </div>
                        )) : <p className="no-data">No courses assigned yet.</p>}
                    </div>
                </div>

                <div className="dashboard-card">
                    <div className="card-header">
                        <h2>Today's Schedule</h2>
                    </div>
                    <div className="schedule-list">
                        {schedule.map((item, index) => (
                            <div key={index} className="schedule-item">
                                <div className="schedule-time">{item.time}</div>
                                <div className="schedule-details">
                                    <h4>{item.course}</h4>
                                    <span>{item.room} • {item.students} students</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="dashboard-card">
                    <div className="card-header">
                        <h2>Pending Tasks</h2>
                    </div>
                    <div className="task-list">
                        <div className="task-item pending">
                            <input type="checkbox" />
                            <span>Grade CS301 Mid-term Papers</span>
                        </div>
                        <div className="task-item pending">
                            <input type="checkbox" />
                            <span>Upload CS401 Assignment</span>
                        </div>
                        <div className="task-item completed">
                            <input type="checkbox" checked readOnly />
                            <span>Submit Attendance Report</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FacultyDashboard;
