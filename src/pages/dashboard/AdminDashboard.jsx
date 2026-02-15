import { useState, useEffect } from 'react';
import { FiUsers, FiBook, FiDollarSign, FiUserCheck, FiTrendingUp, FiActivity } from 'react-icons/fi';
import api from '../../services/api';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import './Dashboard.css';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    const [recentActivities, setRecentActivities] = useState([]);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const [studentsRes, usersRes, coursesRes, feesRes, marksRes] = await Promise.all([
                api.get('/students'),
                api.get('/users'),
                api.get('/courses'),
                api.get('/fees'),
                api.get('/marks')
            ]);

            const faculty = usersRes.data.filter(u => u.role === 'FACULTY').length;
            const totalRevenue = feesRes.data.filter(f => f.status === 'PAID').reduce((s, f) => s + f.amount, 0);
            const pendingFees = feesRes.data.filter(f => f.status !== 'PAID').reduce((s, f) => s + f.amount, 0);

            setStats({
                totalStudents: studentsRes.data.length,
                totalFaculty: faculty,
                totalCourses: coursesRes.data.length,
                totalRevenue,
                pendingFees
            });

            // Generate Recent Activities
            const activities = [
                ...studentsRes.data.map(s => ({
                    type: 'enrollment',
                    action: `New student enrolled: ${s.name}`,
                    user: 'System',
                    date: new Date(s.createdAt || Date.now())
                })),
                ...feesRes.data.filter(f => f.status === 'PAID').map(f => ({
                    type: 'payment',
                    action: `Fee payment received: ₹${f.amount}`,
                    user: 'Student',
                    date: new Date(f.updatedAt || Date.now())
                })),
                ...marksRes.data.map(m => ({
                    type: 'marks',
                    action: `Marks uploaded for ${m.courseId?.code || 'Course'}`,
                    user: 'Faculty',
                    date: new Date(m.createdAt || Date.now())
                })),
                ...coursesRes.data.map(c => ({
                    type: 'course',
                    action: `New course added: ${c.name}`,
                    user: 'Admin',
                    date: new Date(c.createdAt || Date.now())
                }))
            ];

            const sortedActivities = activities
                .sort((a, b) => b.date - a.date)
                .slice(0, 5)
                .map((a, i) => ({
                    id: i,
                    type: a.type,
                    action: a.action,
                    user: a.user,
                    time: a.date.toLocaleDateString() === new Date().toLocaleDateString()
                        ? a.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        : a.date.toLocaleDateString()
                }));

            setRecentActivities(sortedActivities);

        } catch (err) {
            console.error('Failed to load dashboard stats', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading || !stats) return <div className="dashboard"><SkeletonLoader type="table" count={4} /></div>;

    const statCards = [
        { icon: FiUsers, label: 'Total Students', value: stats.totalStudents.toLocaleString(), change: '+12%', color: 'blue' },
        { icon: FiUserCheck, label: 'Total Faculty', value: stats.totalFaculty, change: '+5%', color: 'green' },
        { icon: FiBook, label: 'Total Courses', value: stats.totalCourses, change: '+8%', color: 'purple' },
        { icon: FiDollarSign, label: 'Total Revenue', value: `₹${(stats.totalRevenue / 100000).toFixed(1)}L`, change: '+18%', color: 'orange' }
    ];

    const getActivityIcon = (type) => {
        const icons = { enrollment: '👤', payment: '💰', marks: '📊', course: '📚' };
        return icons[type] || '📌';
    };

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <div>
                    <h1>Admin Dashboard</h1>
                    <p>Welcome back! Here's what's happening at your institution.</p>
                </div>
                <div className="header-actions">
                    <button className="btn btn-outline">
                        <FiActivity /> Generate Report
                    </button>
                </div>
            </div>

            <div className="stats-grid">
                {statCards.map((stat, index) => (
                    <div key={index} className={`stat-card ${stat.color}`}>
                        <div className="stat-icon"><stat.icon size={24} /></div>
                        <div className="stat-content"><h3>{stat.value}</h3><p>{stat.label}</p></div>
                        <span className="stat-change positive">{stat.change}</span>
                    </div>
                ))}
            </div>

            <div className="dashboard-grid">
                <div className="dashboard-card chart-card">
                    <div className="card-header">
                        <h2>Enrollment Overview</h2>
                        <select className="period-select">
                            <option>This Month</option>
                            <option>Last Month</option>
                            <option>This Year</option>
                        </select>
                    </div>
                    <div className="chart-placeholder">
                        <FiTrendingUp size={48} />
                        <p>Enrollment trends chart</p>
                        <div className="chart-bars">
                            <div className="bar" style={{ height: '60%' }}><span>Jan</span></div>
                            <div className="bar" style={{ height: '75%' }}><span>Feb</span></div>
                            <div className="bar" style={{ height: '45%' }}><span>Mar</span></div>
                            <div className="bar" style={{ height: '90%' }}><span>Apr</span></div>
                            <div className="bar" style={{ height: '65%' }}><span>May</span></div>
                            <div className="bar" style={{ height: '80%' }}><span>Jun</span></div>
                        </div>
                    </div>
                </div>

                <div className="dashboard-card">
                    <div className="card-header">
                        <h2>Recent Activities</h2>
                        <button className="btn-link">View All</button>
                    </div>
                    <div className="activity-list">
                        {recentActivities.map(activity => (
                            <div key={activity.id} className="activity-item">
                                <span className="activity-icon">{getActivityIcon(activity.type)}</span>
                                <div className="activity-content">
                                    <p className="activity-action">{activity.action}</p>
                                    <span className="activity-user">{activity.user}</span>
                                </div>
                                <span className="activity-time">{activity.time}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="dashboard-card">
                    <div className="card-header"><h2>Fee Collection</h2></div>
                    <div className="fee-summary">
                        <div className="fee-item">
                            <div className="fee-info">
                                <span className="fee-label">Collected</span>
                                <span className="fee-value collected">₹{(stats.totalRevenue / 100000).toFixed(1)}L</span>
                            </div>
                            <div className="fee-bar">
                                <div className="fee-progress" style={{ width: `${stats.totalRevenue / (stats.totalRevenue + stats.pendingFees) * 100}%` }}></div>
                            </div>
                        </div>
                        <div className="fee-item">
                            <div className="fee-info">
                                <span className="fee-label">Pending</span>
                                <span className="fee-value pending">₹{(stats.pendingFees / 100000).toFixed(1)}L</span>
                            </div>
                            <div className="fee-bar">
                                <div className="fee-progress pending" style={{ width: `${stats.pendingFees / (stats.totalRevenue + stats.pendingFees) * 100}%` }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="dashboard-card quick-actions-card">
                    <div className="card-header"><h2>Quick Actions</h2></div>
                    <div className="quick-actions">
                        <button className="quick-action"><span className="action-icon">➕</span><span>Add Student</span></button>
                        <button className="quick-action"><span className="action-icon">📚</span><span>New Course</span></button>
                        <button className="quick-action"><span className="action-icon">👨‍🏫</span><span>Add Faculty</span></button>
                        <button className="quick-action"><span className="action-icon">📢</span><span>Announcement</span></button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
