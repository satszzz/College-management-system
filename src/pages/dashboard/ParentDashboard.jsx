import { useState, useEffect } from 'react';
import { FiAward, FiDollarSign, FiCalendar, FiTrendingUp } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import './Dashboard.css';

const ParentDashboard = () => {
    const { user } = useAuth();
    const [childData, setChildData] = useState(null);
    const [marks, setMarks] = useState([]);
    const [fees, setFees] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Get child details
                if (user?.studentId) {
                    const { data: student } = await api.get(`/students/${user.studentId}`);
                    setChildData(student);

                    // 2. Fetch marks and fees for the child
                    const [marksRes, feesRes] = await Promise.all([
                        api.get(`/marks?studentId=${user.studentId}`),
                        api.get(`/fees?studentId=${user.studentId}`)
                    ]);

                    setMarks(marksRes.data);
                    setFees(feesRes.data);
                }
            } catch (err) {
                console.error('Failed to load parent dashboard data', err);
            } finally {
                setLoading(false);
            }
        };

        if (user?.studentId) {
            fetchData();
        } else {
            setLoading(false);
        }
    }, [user]);

    if (loading) return <div className="dashboard"><SkeletonLoader type="card" count={4} /></div>;
    if (!user?.studentId || !childData) return <div className="dashboard"><p>No student linked to this parent account.</p></div>;

    // Calculate average percentage
    const calculateAverage = () => {
        if (marks.length === 0) return 0;
        const total = marks.reduce((sum, m) => sum + (m.total / (m.maxMarks || 100) * 100), 0);
        return (total / marks.length).toFixed(1);
    };

    const paidFees = fees.filter(f => f.status === 'PAID');
    const pendingFees = fees.filter(f => f.status !== 'PAID');

    const statCards = [
        {
            icon: FiTrendingUp,
            label: 'Average Score',
            value: `${calculateAverage()}%`,
            color: 'blue'
        },
        {
            icon: FiAward,
            label: 'Courses Completed',
            value: marks.length,
            color: 'green'
        },
        {
            icon: FiDollarSign,
            label: 'Fees Paid',
            value: `₹${paidFees.reduce((sum, f) => sum + f.amount, 0).toLocaleString()}`,
            color: 'purple'
        },
        {
            icon: FiCalendar,
            label: 'Pending Payments',
            value: pendingFees.length,
            color: 'orange'
        }
    ];

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <div>
                    <h1>Parent Dashboard</h1>
                    <p>Monitor your child's academic progress and fee status.</p>
                </div>
                <div className="child-info">
                    <span className="child-label">Viewing for:</span>
                    <span className="child-name">{childData.name} ({childData.rollNumber})</span>
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
                        <h2>Academic Performance</h2>
                    </div>
                    <div className="marks-list">
                        {marks.length > 0 ? marks.map(mark => (
                            <div key={mark._id} className="mark-item">
                                <div className="mark-info">
                                    <h4>{mark.courseId?.name || 'Unknown Course'}</h4>
                                    <span className="course-code">{mark.courseId?.code}</span>
                                </div>
                                <div className="mark-score">
                                    <span className="score">{mark.total}/{mark.maxMarks || 100}</span>
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
                        <h2>Fee Payment Status</h2>
                    </div>
                    <div className="fee-summary-parent">
                        <div className="fee-total paid">
                            <span className="label">Total Paid</span>
                            <span className="value">₹{paidFees.reduce((sum, f) => sum + f.amount, 0).toLocaleString()}</span>
                        </div>
                        <div className="fee-total pending">
                            <span className="label">Pending Amount</span>
                            <span className="value">₹{pendingFees.reduce((sum, f) => sum + f.amount, 0).toLocaleString()}</span>
                        </div>
                    </div>
                    <div className="fee-list">
                        {fees.length > 0 ? fees.map(fee => (
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
                        )) : <p className="no-data">No fees found</p>}
                    </div>
                </div>

                <div className="dashboard-card contact-card">
                    <div className="card-header">
                        <h2>Contact Faculty</h2>
                    </div>
                    <div className="contact-list">
                        <div className="contact-item">
                            <div className="contact-avatar">PS</div>
                            <div className="contact-info">
                                <h4>Prof. Priya Sharma</h4>
                                <span>Class Coordinator</span>
                            </div>
                            <button className="btn-contact">Message</button>
                        </div>
                        <div className="contact-item">
                            <div className="contact-avatar">RK</div>
                            <div className="contact-info">
                                <h4>Dr. Rajesh Kumar</h4>
                                <span>HOD - Computer Science</span>
                            </div>
                            <button className="btn-contact">Message</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ParentDashboard;
