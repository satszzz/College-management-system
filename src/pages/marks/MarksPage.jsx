import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/common/Toast';
import api from '../../services/api';
import { exportToCSV } from '../../services/storageService';
import Pagination from '../../components/common/Pagination';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import { FiSearch, FiFilter, FiDownload, FiTrendingUp, FiTrendingDown, FiBarChart2 } from 'react-icons/fi';
import '../Pages.css';

const MarksPage = () => {
    const { user } = useAuth();
    const toast = useToast();

    const [marks, setMarks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSemester, setSelectedSemester] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [sortField, setSortField] = useState('');
    const [sortDir, setSortDir] = useState('asc');
    const itemsPerPage = 10;

    useEffect(() => {
        fetchMarks();
    }, []);

    const fetchMarks = async () => {
        try {
            setLoading(true);
            let url = '/marks';

            if (user?.role === 'STUDENT') {
                // Find student record first
                const { data: students } = await api.get(`/students?userId=${user.id}`);
                if (students.length > 0) {
                    url = `/marks?studentId=${students[0]._id}`;
                } else {
                    setMarks([]);
                    return;
                }
            } else if (user?.role === 'PARENT') {
                if (user.studentId) {
                    url = `/marks?studentId=${user.studentId}`;
                } else {
                    setMarks([]);
                    return;
                }
            }

            const { data } = await api.get(url);
            setMarks(data);
        } catch (err) {
            console.error(err);
            toast.error('Failed to load marks');
        } finally {
            setLoading(false);
        }
    };

    const filteredMarks = useMemo(() => {
        let result = marks.filter(mark => {
            const studentName = mark.studentId?.name || '';
            const courseName = mark.courseId?.name || '';
            const courseCode = mark.courseId?.code || '';
            const matchesSearch = !searchTerm ||
                studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                courseCode.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesSemester = !selectedSemester || mark.semester === parseInt(selectedSemester);
            return matchesSearch && matchesSemester;
        });

        if (sortField) {
            result = [...result].sort((a, b) => {
                let aVal, bVal;
                if (sortField === 'student') {
                    aVal = a.studentId?.name || '';
                    bVal = b.studentId?.name || '';
                } else if (sortField === 'percentage') {
                    aVal = (a.total / a.maxMarks) * 100;
                    bVal = (b.total / b.maxMarks) * 100;
                } else if (sortField === 'total') {
                    aVal = a.total; bVal = b.total;
                } else if (sortField === 'grade') {
                    aVal = a.grade; bVal = b.grade;
                }
                if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
                if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return result;
    }, [marks, searchTerm, selectedSemester, sortField, sortDir]);

    const paginatedMarks = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredMarks.slice(start, start + itemsPerPage);
    }, [filteredMarks, currentPage]);

    const summaryStats = useMemo(() => {
        if (filteredMarks.length === 0) return { avg: 0, highest: 0, lowest: 0 };
        const percentages = filteredMarks.map(m => (m.total / m.maxMarks) * 100);
        return {
            avg: (percentages.reduce((a, b) => a + b, 0) / percentages.length).toFixed(1),
            highest: Math.max(...percentages).toFixed(1),
            lowest: Math.min(...percentages).toFixed(1),
        };
    }, [filteredMarks]);

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDir('asc');
        }
    };

    const handleExport = () => {
        const exportData = filteredMarks.map(mark => ({
            Student: mark.studentId?.name || 'Unknown',
            Course: mark.courseId?.name || 'Unknown',
            Code: mark.courseId?.code || '',
            Internal: mark.internal,
            External: mark.external,
            Total: mark.total,
            MaxMarks: mark.maxMarks,
            Percentage: ((mark.total / mark.maxMarks) * 100).toFixed(1) + '%',
            Grade: mark.grade,
            Semester: mark.semester
        }));
        exportToCSV(exportData, 'marks_report', [
            { key: 'Student', label: 'Student' },
            { key: 'Course', label: 'Course' },
            { key: 'Code', label: 'Code' },
            { key: 'Internal', label: 'Internal' },
            { key: 'External', label: 'External' },
            { key: 'Total', label: 'Total' },
            { key: 'MaxMarks', label: 'Max Marks' },
            { key: 'Percentage', label: 'Percentage' },
            { key: 'Grade', label: 'Grade' },
            { key: 'Semester', label: 'Semester' }
        ]);
        toast.success('Marks report downloaded as CSV!');
    };

    const SortIcon = ({ field }) => (
        <span className={`sort-icon ${sortField === field ? 'active' : ''}`}>
            {sortField === field ? (sortDir === 'asc' ? '▲' : '▼') : '▲'}
        </span>
    );

    if (loading) return <div className="page"><SkeletonLoader type="table" count={5} /></div>;

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <h1>{user?.role === 'STUDENT' ? 'My Marks' : user?.role === 'PARENT' ? "Child's Performance" : 'Marks Management'}</h1>
                    <p>View and manage academic performance records</p>
                </div>
                <button className="btn btn-primary" style={{ border: 'none' }} onClick={handleExport}>
                    <FiDownload size={16} /> Export CSV
                </button>
            </div>

            <div className="summary-cards stagger-enter">
                <div className="summary-card"><h4>Average Score</h4><div className="value" style={{ color: '#667eea' }}><FiBarChart2 style={{ marginRight: 6 }} />{summaryStats.avg}%</div></div>
                <div className="summary-card"><h4>Highest Score</h4><div className="value" style={{ color: '#37b24d' }}><FiTrendingUp style={{ marginRight: 6 }} />{summaryStats.highest}%</div></div>
                <div className="summary-card"><h4>Lowest Score</h4><div className="value" style={{ color: '#e03131' }}><FiTrendingDown style={{ marginRight: 6 }} />{summaryStats.lowest}%</div></div>
                <div className="summary-card"><h4>Total Records</h4><div className="value">{filteredMarks.length}</div></div>
            </div>

            <div className="filters-bar" style={{ marginTop: '1.5rem' }}>
                <div className="search-box">
                    <FiSearch className="search-icon" />
                    <input type="text" placeholder="Search by student or course..." value={searchTerm} onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }} />
                </div>
                <div className="filter-group">
                    <FiFilter className="filter-icon" />
                    <select value={selectedSemester} onChange={e => { setSelectedSemester(e.target.value); setCurrentPage(1); }}>
                        <option value="">All Semesters</option>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={s}>Semester {s}</option>)}
                    </select>
                </div>
            </div>

            <div className="table-container" id="marks-table">
                <table className="data-table">
                    <thead>
                        <tr>
                            {(user?.role !== 'STUDENT') && <th className="sortable-th" onClick={() => handleSort('student')}>Student <SortIcon field="student" /></th>}
                            <th>Course</th>
                            <th>Internal</th>
                            <th>External</th>
                            <th className="sortable-th" onClick={() => handleSort('total')}>Total <SortIcon field="total" /></th>
                            <th className="sortable-th" onClick={() => handleSort('percentage')}>Percentage <SortIcon field="percentage" /></th>
                            <th className="sortable-th" onClick={() => handleSort('grade')}>Grade <SortIcon field="grade" /></th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedMarks.length === 0 ? (
                            <tr><td colSpan="7" className="empty-state">No marks found</td></tr>
                        ) : paginatedMarks.map(mark => {
                            const percentage = ((mark.total / mark.maxMarks) * 100).toFixed(1);
                            return (
                                <tr key={mark._id}>
                                    {(user?.role !== 'STUDENT') && <td>{mark.studentId?.name || 'Unknown'}</td>}
                                    <td><span className="code-badge">{mark.courseId?.code}</span> {mark.courseId?.name}</td>
                                    <td>{mark.internal}</td>
                                    <td>{mark.external}</td>
                                    <td className="total-cell">{mark.total}/{mark.maxMarks}</td>
                                    <td>{percentage}%</td>
                                    <td><span className={`grade-badge grade-${mark.grade.replace('+', 'plus')}`}>{mark.grade}</span></td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <Pagination currentPage={currentPage} totalItems={filteredMarks.length} itemsPerPage={itemsPerPage} onPageChange={setCurrentPage} />
        </div>
    );
};

export default MarksPage;
