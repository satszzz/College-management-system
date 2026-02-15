import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/common/Toast';
import api from '../../services/api';
import Modal from '../../components/common/Modal';
import Pagination from '../../components/common/Pagination';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import { FiSearch, FiFilter, FiPlus, FiEdit2, FiTrash2, FiBook, FiUsers, FiAlertTriangle } from 'react-icons/fi';
import '../Pages.css';

const CoursesPage = () => {
    const { user } = useAuth();
    const toast = useToast();

    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDept, setSelectedDept] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [formData, setFormData] = useState({ code: '', name: '', credits: 3, department: '', semester: 1, faculty: '', description: '' });

    useEffect(() => { fetchCourses(); }, []);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/courses');
            setCourses(data);
        } catch (err) {
            toast.error('Failed to load courses');
        } finally {
            setLoading(false);
        }
    };

    const departments = [...new Set(courses.map(c => c.department))];

    const filteredCourses = useMemo(() => {
        return courses.filter(c => {
            const matchesSearch = !searchTerm ||
                c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.code.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesDept = !selectedDept || c.department === selectedDept;
            return matchesSearch && matchesDept;
        });
    }, [courses, searchTerm, selectedDept]);

    const paginatedCourses = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredCourses.slice(start, start + itemsPerPage);
    }, [filteredCourses, currentPage]);

    const openAddModal = () => {
        setEditingCourse(null);
        setFormData({ code: '', name: '', credits: 3, department: '', semester: 1, faculty: '', description: '' });
        setShowModal(true);
    };

    const openEditModal = (c) => {
        setEditingCourse(c);
        setFormData({ code: c.code, name: c.name, credits: c.credits, department: c.department, semester: c.semester, faculty: c.faculty, description: c.description || '' });
        setShowModal(true);
    };

    const handleSave = async () => {
        if (!formData.code || !formData.name || !formData.department) {
            toast.warning('Please fill in all required fields');
            return;
        }
        try {
            if (editingCourse) {
                await api.put(`/courses/${editingCourse._id}`, formData);
                toast.success(`Course "${formData.name}" updated`);
            } else {
                await api.post('/courses', formData);
                toast.success(`Course "${formData.name}" added`);
            }
            setShowModal(false);
            fetchCourses();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to save course');
        }
    };

    const confirmDelete = (c) => { setDeleteTarget(c); setShowDeleteModal(true); };
    const handleDelete = async () => {
        try {
            await api.delete(`/courses/${deleteTarget._id}`);
            toast.success(`Course "${deleteTarget.name}" deleted`);
            setShowDeleteModal(false);
            fetchCourses();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete course');
        }
    };

    if (loading) return <div className="page"><SkeletonLoader type="card" count={6} /></div>;

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <h1>{user?.role === 'STUDENT' ? 'My Courses' : 'Course Management'}</h1>
                    <p>Browse and manage available courses</p>
                </div>
                {(user?.role === 'ADMIN') && (
                    <button className="btn btn-primary" style={{ border: 'none' }} onClick={openAddModal}>
                        <FiPlus size={18} /> Add Course
                    </button>
                )}
            </div>

            <div className="filters-bar">
                <div className="search-box">
                    <FiSearch className="search-icon" />
                    <input type="text" placeholder="Search courses..." value={searchTerm} onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }} />
                </div>
                <div className="filter-group">
                    <FiFilter className="filter-icon" />
                    <select value={selectedDept} onChange={e => { setSelectedDept(e.target.value); setCurrentPage(1); }}>
                        <option value="">All Departments</option>
                        {departments.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                </div>
            </div>

            <p className="results-info">Showing {filteredCourses.length} courses</p>

            <div className="courses-grid">
                {paginatedCourses.length === 0 ? (
                    <div className="empty-state-box"><FiBook size={48} /><h3>No courses found</h3></div>
                ) : paginatedCourses.map(course => (
                    <div className="course-card" key={course._id}>
                        <div className="course-header">
                            <span className="code-badge">{course.code}</span>
                            <span className="credits-badge">{course.credits} Credits</span>
                        </div>
                        <h3 className="course-name">{course.name}</h3>
                        <p className="course-description">{course.description || 'No description available'}</p>
                        <div className="course-meta">
                            <span className="meta-item"><FiBook size={14} /> {course.department}</span>
                            <span className="meta-item"><FiUsers size={14} /> {course.enrolledStudents || 0} students</span>
                        </div>
                        <div className="course-faculty">
                            <span>Instructor: {course.faculty}</span>
                        </div>
                        {(user?.role === 'ADMIN') && (
                            <div className="course-actions">
                                <button className="action-btn edit" onClick={() => openEditModal(course)}><FiEdit2 size={14} /></button>
                                <button className="action-btn delete" onClick={() => confirmDelete(course)}><FiTrash2 size={14} /></button>
                            </div>
                        )}
                        {(user?.role === 'STUDENT') && (
                            <button className="btn-primary-sm" style={{ marginTop: '0.75rem' }} onClick={() => toast.info('Enrollment functionality coming soon!')}>
                                Enroll
                            </button>
                        )}
                    </div>
                ))}
            </div>

            <Pagination currentPage={currentPage} totalItems={filteredCourses.length} itemsPerPage={itemsPerPage} onPageChange={setCurrentPage} />

            {/* Add/Edit Modal */}
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingCourse ? 'Edit Course' : 'Add New Course'}>
                <div className="modal-form">
                    <div className="modal-form-row">
                        <div className="form-group"><label>Course Code *</label><input type="text" value={formData.code} onChange={e => setFormData({ ...formData, code: e.target.value })} placeholder="e.g., CS301" /></div>
                        <div className="form-group"><label>Course Name *</label><input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Enter course name" /></div>
                    </div>
                    <div className="modal-form-row">
                        <div className="form-group">
                            <label>Department *</label>
                            <select value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })}>
                                <option value="">Select</option>
                                <option value="Computer Science">Computer Science</option>
                                <option value="Information Technology">Information Technology</option>
                                <option value="Electronics">Electronics</option>
                                <option value="Mathematics">Mathematics</option>
                            </select>
                        </div>
                        <div className="form-group"><label>Credits</label><input type="number" min="1" max="6" value={formData.credits} onChange={e => setFormData({ ...formData, credits: parseInt(e.target.value) })} /></div>
                    </div>
                    <div className="modal-form-row">
                        <div className="form-group">
                            <label>Semester</label>
                            <select value={formData.semester} onChange={e => setFormData({ ...formData, semester: parseInt(e.target.value) })}>
                                {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={s}>Semester {s}</option>)}
                            </select>
                        </div>
                        <div className="form-group"><label>Faculty</label><input type="text" value={formData.faculty} onChange={e => setFormData({ ...formData, faculty: e.target.value })} placeholder="Instructor name" /></div>
                    </div>
                    <div className="form-group"><label>Description</label><textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="Course description" rows={3} /></div>
                    <div className="modal-actions">
                        <button className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                        <button className="btn-save" onClick={handleSave}>{editingCourse ? 'Update' : 'Add'} Course</button>
                    </div>
                </div>
            </Modal>

            {/* Delete Confirmation */}
            <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Confirm Delete" size="sm">
                <div className="confirm-dialog">
                    <div className="confirm-icon"><FiAlertTriangle size={28} /></div>
                    <h3>Delete Course?</h3>
                    <p>Remove <strong>{deleteTarget?.name}</strong> ({deleteTarget?.code})?</p>
                    <div className="confirm-actions">
                        <button className="btn-cancel" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                        <button className="btn-danger" onClick={handleDelete}>Delete</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default CoursesPage;
