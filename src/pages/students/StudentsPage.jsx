import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/common/Toast';
import api from '../../services/api';
import Modal from '../../components/common/Modal';
import Pagination from '../../components/common/Pagination';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import { FiSearch, FiFilter, FiPlus, FiEye, FiEdit2, FiTrash2, FiMail, FiPhone, FiBook, FiAlertTriangle } from 'react-icons/fi';
import '../Pages.css';

const StudentsPage = () => {
    const { user } = useAuth();
    const toast = useToast();

    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const [showModal, setShowModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);
    const [viewingStudent, setViewingStudent] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [formData, setFormData] = useState({ name: '', rollNumber: '', email: '', phone: '', department: '', semester: 1, enrollmentYear: new Date().getFullYear() });

    // Fetch students from API
    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/students');
            setStudents(data);
        } catch (err) {
            toast.error('Failed to load students');
        } finally {
            setLoading(false);
        }
    };

    const departments = [...new Set(students.map(s => s.department))];

    const filteredStudents = useMemo(() => {
        return students.filter(s => {
            const matchesSearch = !searchTerm ||
                s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                s.rollNumber.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesDept = !selectedDepartment || s.department === selectedDepartment;
            return matchesSearch && matchesDept;
        });
    }, [students, searchTerm, selectedDepartment]);

    const paginatedStudents = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredStudents.slice(start, start + itemsPerPage);
    }, [filteredStudents, currentPage]);

    const openAddModal = () => {
        setEditingStudent(null);
        setFormData({ name: '', rollNumber: '', email: '', phone: '', department: '', semester: 1, enrollmentYear: new Date().getFullYear() });
        setShowModal(true);
    };

    const openEditModal = (s) => {
        setEditingStudent(s);
        setFormData({ name: s.name, rollNumber: s.rollNumber, email: s.email, phone: s.phone || '', department: s.department, semester: s.semester, enrollmentYear: s.enrollmentYear });
        setShowModal(true);
    };

    const handleSave = async () => {
        if (!formData.name || !formData.rollNumber || !formData.email) {
            toast.warning('Please fill in all required fields');
            return;
        }
        try {
            if (editingStudent) {
                await api.put(`/students/${editingStudent._id}`, formData);
                toast.success(`Student "${formData.name}" updated successfully`);
            } else {
                await api.post('/students', formData);
                toast.success(`Student "${formData.name}" added successfully`);
            }
            setShowModal(false);
            fetchStudents();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to save student');
        }
    };

    const confirmDelete = (s) => { setDeleteTarget(s); setShowDeleteModal(true); };
    const handleDelete = async () => {
        try {
            await api.delete(`/students/${deleteTarget._id}`);
            toast.success(`Student "${deleteTarget.name}" removed`);
            setShowDeleteModal(false);
            fetchStudents();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete student');
        }
    };

    const viewStudent = (s) => { setViewingStudent(s); setShowViewModal(true); };

    if (loading) return <div className="page"><SkeletonLoader type="card" count={6} /></div>;

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <h1>Students</h1>
                    <p>Manage student records and information</p>
                </div>
                <div className="header-actions">
                    <button className="btn btn-primary" style={{ border: 'none' }} onClick={openAddModal}>
                        <FiPlus size={18} /> Add Student
                    </button>
                </div>
            </div>

            <div className="filters-bar">
                <div className="search-box">
                    <FiSearch className="search-icon" />
                    <input type="text" placeholder="Search students..." value={searchTerm} onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }} />
                </div>
                <div className="filter-group">
                    <FiFilter className="filter-icon" />
                    <select value={selectedDepartment} onChange={e => { setSelectedDepartment(e.target.value); setCurrentPage(1); }}>
                        <option value="">All Departments</option>
                        {departments.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                </div>
            </div>

            <p className="results-info">Showing {filteredStudents.length} students</p>

            <div className="students-grid">
                {paginatedStudents.length === 0 ? (
                    <div className="empty-state-box"><FiBook size={48} /><h3>No students found</h3></div>
                ) : paginatedStudents.map(s => (
                    <div className="student-card" key={s._id}>
                        <div className="student-avatar">{s.name.charAt(0)}</div>
                        <div className="student-info">
                            <h3>{s.name}</h3>
                            <span className="roll-number">{s.rollNumber}</span>
                        </div>
                        <div className="student-details">
                            <div className="detail-row"><FiMail size={14} /> {s.email}</div>
                            <div className="detail-row"><FiPhone size={14} /> {s.phone || 'N/A'}</div>
                        </div>
                        <div className="student-meta">
                            <span className="dept-badge">{s.department}</span>
                            <span className="sem-badge">Sem {s.semester}</span>
                        </div>
                        <div className="student-actions">
                            <button className="action-btn view" onClick={() => viewStudent(s)} title="View"><FiEye size={14} /></button>
                            <button className="action-btn edit" onClick={() => openEditModal(s)} title="Edit"><FiEdit2 size={14} /></button>
                            <button className="action-btn delete" onClick={() => confirmDelete(s)} title="Delete"><FiTrash2 size={14} /></button>
                        </div>
                    </div>
                ))}
            </div>

            <Pagination currentPage={currentPage} totalItems={filteredStudents.length} itemsPerPage={itemsPerPage} onPageChange={setCurrentPage} />

            {/* Add/Edit Modal */}
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingStudent ? 'Edit Student' : 'Add New Student'}>
                <div className="modal-form">
                    <div className="modal-form-row">
                        <div className="form-group"><label>Full Name *</label><input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Enter name" /></div>
                        <div className="form-group"><label>Roll Number *</label><input type="text" value={formData.rollNumber} onChange={e => setFormData({ ...formData, rollNumber: e.target.value })} placeholder="e.g., CS2021001" /></div>
                    </div>
                    <div className="modal-form-row">
                        <div className="form-group"><label>Email *</label><input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="Enter email" /></div>
                        <div className="form-group"><label>Phone</label><input type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="Enter phone" /></div>
                    </div>
                    <div className="modal-form-row">
                        <div className="form-group">
                            <label>Department</label>
                            <select value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })}>
                                <option value="">Select Department</option>
                                <option value="Computer Science">Computer Science</option>
                                <option value="Information Technology">Information Technology</option>
                                <option value="Electronics">Electronics</option>
                                <option value="Mechanical">Mechanical</option>
                                <option value="Civil">Civil</option>
                                <option value="Mathematics">Mathematics</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Semester</label>
                            <select value={formData.semester} onChange={e => setFormData({ ...formData, semester: parseInt(e.target.value) })}>
                                {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={s}>Semester {s}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="modal-actions">
                        <button className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                        <button className="btn-save" onClick={handleSave}>{editingStudent ? 'Update' : 'Add'} Student</button>
                    </div>
                </div>
            </Modal>

            {/* View Modal */}
            <Modal isOpen={showViewModal} onClose={() => setShowViewModal(false)} title="Student Details">
                {viewingStudent && (
                    <div style={{ textAlign: 'center' }}>
                        <div className="student-avatar" style={{ margin: '0 auto 1rem' }}>{viewingStudent.name.charAt(0)}</div>
                        <h2>{viewingStudent.name}</h2>
                        <p style={{ color: '#667eea', fontWeight: 500 }}>{viewingStudent.rollNumber}</p>
                        <div style={{ marginTop: '1.5rem', textAlign: 'left', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div><strong>Email:</strong><br />{viewingStudent.email}</div>
                            <div><strong>Phone:</strong><br />{viewingStudent.phone || 'N/A'}</div>
                            <div><strong>Department:</strong><br />{viewingStudent.department}</div>
                            <div><strong>Semester:</strong><br />{viewingStudent.semester}</div>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Delete Confirmation */}
            <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Confirm Delete" size="sm">
                <div className="confirm-dialog">
                    <div className="confirm-icon"><FiAlertTriangle size={28} /></div>
                    <h3>Delete Student?</h3>
                    <p>Are you sure you want to remove <strong>{deleteTarget?.name}</strong>?</p>
                    <div className="confirm-actions">
                        <button className="btn-cancel" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                        <button className="btn-danger" onClick={handleDelete}>Delete</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default StudentsPage;
