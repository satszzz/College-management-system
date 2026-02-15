import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { FiDownload, FiBarChart2, FiTrendingUp, FiUsers, FiDollarSign } from 'react-icons/fi';
import { useToast } from '../../components/common/Toast';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import '../Pages.css';

const ReportsPage = () => {
    const { user } = useAuth();
    const toast = useToast();
    const [reportType, setReportType] = useState('academic');

    const [statsData, setStatsData] = useState({
        marks: [],
        students: [],
        courses: [],
        fees: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReportData = async () => {
            try {
                setLoading(true);
                const [marksRes, studentsRes, coursesRes, feesRes] = await Promise.all([
                    api.get('/marks'),
                    api.get('/students'),
                    api.get('/courses'),
                    api.get('/fees')
                ]);

                setStatsData({
                    marks: marksRes.data,
                    students: studentsRes.data,
                    courses: coursesRes.data,
                    fees: feesRes.data
                });
            } catch (err) {
                console.error('Error fetching report data:', err);
                toast.error('Failed to load report data');
            } finally {
                setLoading(false);
            }
        };

        fetchReportData();
    }, []);

    const { marks, students, fees, courses } = statsData;

    const academicStats = useMemo(() => {
        if (loading) return { totalStudents: 0, avgScore: 0, gradeDistribution: {} };
        const totalStudents = students.length;
        const avgScore = marks.length > 0
            ? (marks.reduce((sum, m) => sum + (m.total / m.maxMarks) * 100, 0) / marks.length).toFixed(1)
            : 0;
        const gradeDistribution = marks.reduce((acc, m) => {
            acc[m.grade] = (acc[m.grade] || 0) + 1;
            return acc;
        }, {});
        return { totalStudents, avgScore, gradeDistribution };
    }, [marks, students, loading]);

    const feeStats = useMemo(() => {
        if (loading) return { totalFees: 0, collected: 0, pending: 0, overdue: 0 };
        const totalFees = fees.reduce((sum, f) => sum + f.amount, 0);
        const collected = fees.filter(f => f.status === 'PAID').reduce((sum, f) => sum + f.amount, 0);
        const pending = fees.filter(f => f.status === 'PENDING').reduce((sum, f) => sum + f.amount, 0);
        const overdue = fees.filter(f => f.status === 'OVERDUE').reduce((sum, f) => sum + f.amount, 0);
        return { totalFees, collected, pending, overdue };
    }, [fees, loading]);

    const handleExport = (type) => {
        toast.success(`${type} report exported successfully!`);
    };

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <h1>Reports</h1>
                    <p>View analytics and generate detailed reports</p>
                </div>
                <div className="header-actions">
                    <div className="view-toggle">
                        <button className={reportType === 'academic' ? 'active' : ''} onClick={() => setReportType('academic')}>Academic</button>
                        <button className={reportType === 'financial' ? 'active' : ''} onClick={() => setReportType('financial')}>Financial</button>
                    </div>
                    <button className="btn btn-primary" style={{ border: 'none' }} onClick={() => handleExport(reportType)}>
                        <FiDownload size={16} /> Export
                    </button>
                </div>
            </div>

            {reportType === 'academic' ? (
                <>
                    <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                        <div className="stat-card blue">
                            <div className="stat-icon"><FiUsers size={24} /></div>
                            <div className="stat-content">
                                <h3>{academicStats.totalStudents}</h3>
                                <p>Total Students</p>
                            </div>
                        </div>
                        <div className="stat-card green">
                            <div className="stat-icon"><FiTrendingUp size={24} /></div>
                            <div className="stat-content">
                                <h3>{academicStats.avgScore}%</h3>
                                <p>Average Score</p>
                            </div>
                        </div>
                        <div className="stat-card purple">
                            <div className="stat-icon"><FiBarChart2 size={24} /></div>
                            <div className="stat-content">
                                <h3>{marks.length}</h3>
                                <p>Total Records</p>
                            </div>
                        </div>
                    </div>

                    <div className="dashboard-card" style={{ marginBottom: '1.5rem' }}>
                        <div className="card-header">
                            <h2>Grade Distribution</h2>
                        </div>
                        <div className="chart-bars" style={{ height: '180px', alignItems: 'flex-end', paddingBottom: '2rem' }}>
                            {Object.entries(academicStats.gradeDistribution).sort().map(([grade, count]) => (
                                <div className="bar" key={grade} style={{ height: `${(count / marks.length) * 100}%` }}>
                                    <span>{grade}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Student</th>
                                    <th>Course</th>
                                    <th>Marks</th>
                                    <th>Grade</th>
                                    <th>Semester</th>
                                </tr>
                            </thead>
                            <tbody>
                                {marks.slice(0, 10).map(mark => (
                                    <tr key={mark._id}>
                                        <td>{mark.studentId?.name || 'Unknown'}</td>
                                        <td><span className="code-badge">{mark.courseId?.code}</span> {mark.courseId?.name}</td>
                                        <td className="total-cell">{mark.total}/{mark.maxMarks}</td>
                                        <td><span className={`grade-badge grade-${mark.grade.replace('+', 'plus')}`}>{mark.grade}</span></td>
                                        <td>Semester {mark.semester}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            ) : (
                <>
                    <div className="fee-summary-grid">
                        <div className="fee-summary-card total">
                            <div className="icon-wrapper"><FiDollarSign size={24} /></div>
                            <div className="content">
                                <span className="label">Total Fees</span>
                                <span className="value">₹{feeStats.totalFees.toLocaleString()}</span>
                            </div>
                        </div>
                        <div className="fee-summary-card paid">
                            <div className="icon-wrapper"><FiDollarSign size={24} /></div>
                            <div className="content">
                                <span className="label">Collected</span>
                                <span className="value">₹{feeStats.collected.toLocaleString()}</span>
                            </div>
                        </div>
                        <div className="fee-summary-card pending">
                            <div className="icon-wrapper"><FiDollarSign size={24} /></div>
                            <div className="content">
                                <span className="label">Pending</span>
                                <span className="value">₹{feeStats.pending.toLocaleString()}</span>
                            </div>
                        </div>
                        <div className="fee-summary-card overdue">
                            <div className="icon-wrapper"><FiDollarSign size={24} /></div>
                            <div className="content">
                                <span className="label">Overdue</span>
                                <span className="value">₹{feeStats.overdue.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Student</th>
                                    <th>Fee Type</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                    <th>Due Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {fees.slice(0, 10).map(fee => (
                                    <tr key={fee._id}>
                                        <td>{fee.studentId?.name || 'Unknown'}</td>
                                        <td>{fee.type}</td>
                                        <td className="amount-cell">₹{fee.amount.toLocaleString()}</td>
                                        <td><span className={`status-pill ${fee.status.toLowerCase()}`}>{fee.status}</span></td>
                                        <td>{fee.dueDate}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
};

export default ReportsPage;
