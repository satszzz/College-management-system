import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/common/Toast';
import api from '../../services/api';
import Pagination from '../../components/common/Pagination';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import { FiFilter, FiCheckCircle, FiXCircle, FiClock, FiCalendar, FiUsers, FiCheck } from 'react-icons/fi';
import '../Pages.css';

const AttendancePage = () => {
    const { user } = useAuth();
    const toast = useToast();

    const [records, setRecords] = useState([]);
    const [coursesList, setCoursesList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [currentPage, setCurrentPage] = useState(1);
    const [markMode, setMarkMode] = useState(false);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const { data: courses } = await api.get('/courses');
            setCoursesList(courses);

            let url = '/attendance';
            if (user?.role === 'STUDENT') {
                const { data: students } = await api.get(`/students?userId=${user.id}`);
                if (students.length > 0) {
                    url = `/attendance?studentId=${students[0]._id}`;
                } else {
                    setRecords([]);
                    setLoading(false);
                    return;
                }
            } else if (user?.role === 'PARENT') {
                if (user.studentId) {
                    url = `/attendance?studentId=${user.studentId}`;
                } else {
                    setRecords([]);
                    setLoading(false);
                    return;
                }
            }

            const { data: attendance } = await api.get(url);
            setRecords(attendance);
        } catch (err) {
            console.error(err);
            toast.error('Failed to load attendance data');
        } finally {
            setLoading(false);
        }
    };

    const filteredRecords = useMemo(() => {
        return records.filter(r => {
            const matchesCourse = !selectedCourse || r.courseId?._id === selectedCourse;
            const matchesDate = !selectedDate || r.date === selectedDate;
            return matchesCourse && matchesDate;
        });
    }, [records, selectedCourse, selectedDate]);

    const paginatedRecords = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredRecords.slice(start, start + itemsPerPage);
    }, [filteredRecords, currentPage]);

    const stats = useMemo(() => {
        const total = filteredRecords.length;
        const present = filteredRecords.filter(r => r.status === 'PRESENT').length;
        const absent = filteredRecords.filter(r => r.status === 'ABSENT').length;
        const late = filteredRecords.filter(r => r.status === 'LATE').length;
        return { total, present, absent, late, rate: total > 0 ? ((present / total) * 100).toFixed(1) : 0 };
    }, [filteredRecords]);

    const statusColors = {
        PRESENT: { bg: '#d3f9d8', color: '#2b8a3e', icon: <FiCheckCircle /> },
        ABSENT: { bg: '#ffe3e3', color: '#c92a2a', icon: <FiXCircle /> },
        LATE: { bg: '#fff3bf', color: '#e67700', icon: <FiClock /> }
    };

    const toggleStatus = (id) => {
        const statuses = ['PRESENT', 'ABSENT', 'LATE'];
        setRecords(prev => prev.map(r => {
            if (r._id === id) {
                const currentIdx = statuses.indexOf(r.status);
                return { ...r, status: statuses[(currentIdx + 1) % statuses.length] };
            }
            return r;
        }));
    };

    const saveAttendance = async () => {
        try {
            // Save all modified records
            const updates = filteredRecords.map(r =>
                api.put(`/attendance/${r._id}`, { status: r.status })
            );
            await Promise.all(updates);
            toast.success('Attendance saved successfully!');
            setMarkMode(false);
        } catch (err) {
            toast.error('Failed to save attendance');
        }
    };

    if (loading) return <div className="page"><SkeletonLoader type="table" count={5} /></div>;

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <h1>Attendance</h1>
                    <p>Track and manage student attendance records</p>
                </div>
                <div className="header-actions">
                    {(user?.role === 'ADMIN' || user?.role === 'FACULTY') && (
                        markMode ? (
                            <button className="btn btn-primary" style={{ border: 'none' }} onClick={saveAttendance}>
                                <FiCheck size={18} /> Save Attendance
                            </button>
                        ) : (
                            <button className="btn btn-primary" style={{ border: 'none' }} onClick={() => setMarkMode(true)}>
                                <FiCalendar size={18} /> Mark Attendance
                            </button>
                        )
                    )}
                </div>
            </div>

            {/* Stats */}
            <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '1.5rem' }}>
                <div className="stat-card green">
                    <div className="stat-icon"><FiCheckCircle size={24} /></div>
                    <div className="stat-content"><h3>{stats.present}</h3><p>Present</p></div>
                </div>
                <div className="stat-card" style={{ background: 'white', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', borderRadius: '16px', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div className="stat-icon" style={{ background: 'rgba(224,49,49,0.1)', color: '#e03131', width: 50, height: 50, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FiXCircle size={24} /></div>
                    <div className="stat-content"><h3>{stats.absent}</h3><p>Absent</p></div>
                </div>
                <div className="stat-card" style={{ background: 'white', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', borderRadius: '16px', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div className="stat-icon" style={{ background: 'rgba(253,126,20,0.1)', color: '#fd7e14', width: 50, height: 50, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FiClock size={24} /></div>
                    <div className="stat-content"><h3>{stats.late}</h3><p>Late</p></div>
                </div>
                <div className="stat-card blue">
                    <div className="stat-icon"><FiUsers size={24} /></div>
                    <div className="stat-content"><h3>{stats.rate}%</h3><p>Attendance Rate</p></div>
                </div>
            </div>

            {/* Filters */}
            <div className="filters-bar">
                <div className="filter-group">
                    <FiFilter className="filter-icon" />
                    <select value={selectedCourse} onChange={e => { setSelectedCourse(e.target.value); setCurrentPage(1); }}>
                        <option value="">All Courses</option>
                        {coursesList.map(c => <option key={c._id} value={c._id}>{c.code} - {c.name}</option>)}
                    </select>
                </div>
                <div className="filter-group">
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={e => { setSelectedDate(e.target.value); setCurrentPage(1); }}
                        style={{ padding: '0.75rem 1rem', border: '2px solid #e9ecef', borderRadius: '10px', fontSize: '0.9rem', background: 'white', cursor: 'pointer' }}
                    />
                </div>
            </div>

            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Student</th>
                            <th>Roll Number</th>
                            <th>Course</th>
                            <th>Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedRecords.length === 0 ? (
                            <tr><td colSpan="5" className="empty-state">No attendance records found</td></tr>
                        ) : paginatedRecords.map(r => {
                            const statusStyle = statusColors[r.status];
                            return (
                                <tr key={r._id}>
                                    <td>
                                        <div className="user-cell">
                                            <div className="user-avatar-sm">{r.studentId?.name?.charAt(0)}</div>
                                            <span>{r.studentId?.name || 'Unknown'}</span>
                                        </div>
                                    </td>
                                    <td><span className="code-badge">{r.studentId?.rollNumber}</span></td>
                                    <td>{r.courseId?.code} - {r.courseId?.name}</td>
                                    <td>{r.date}</td>
                                    <td>
                                        <button
                                            onClick={markMode ? () => toggleStatus(r._id) : undefined}
                                            style={{
                                                display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                                                padding: '0.35rem 0.75rem', borderRadius: '20px',
                                                fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase',
                                                background: statusStyle.bg, color: statusStyle.color,
                                                border: markMode ? `2px dashed ${statusStyle.color}` : 'none',
                                                cursor: markMode ? 'pointer' : 'default',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            <span style={{ fontSize: '0.9rem' }}>{statusStyle.icon}</span>
                                            {r.status}
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <Pagination currentPage={currentPage} totalItems={filteredRecords.length} itemsPerPage={itemsPerPage} onPageChange={setCurrentPage} />
        </div>
    );
};

export default AttendancePage;
