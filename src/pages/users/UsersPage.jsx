import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/common/Toast';
import api from '../../services/api';
import Modal from '../../components/common/Modal';
import Pagination from '../../components/common/Pagination';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import { FiSearch, FiFilter, FiPlus, FiEdit2, FiTrash2, FiMail, FiAlertTriangle } from 'react-icons/fi';
import '../Pages.css';

const UsersPage = () => {
    const { user } = useAuth();
    const toast = useToast();

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRole, setSelectedRole] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [formData, setFormData] = useState({ name: '', email: '', role: 'STUDENT', phone: '', password: '' });

    const [students, setStudentsList] = useState([]);

    useEffect(() => {
        fetchUsers();
        fetchStudentsForDropdown();
    }, []);

    const fetchStudentsForDropdown = async () => {
        try {
            const { data } = await api.get('/students');
            setStudentsList(data);
        } catch (err) {
            console.error('Failed to load students for dropdown');
        }
    };

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/users');
            setUsers(data);
        } catch (err) {
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    // ... (rest of code)

    const openAddModal = () => {
        setEditingUser(null);
        setFormData({ name: '', email: '', role: 'STUDENT', phone: '', password: '', studentId: '' });
        setShowModal(true);
    };

    const openEditModal = (u) => {
        setEditingUser(u);
        setFormData({
            name: u.name,
            email: u.email,
            role: u.role,
            phone: u.phone || '',
            password: '',
            studentId: u.studentId || ''
        });
        setShowModal(true);
    };

    const handleSave = async () => {
        // ... (validation)
        if (!formData.name || !formData.email) {
            toast.warning('Please fill in all required fields');
            return;
        }

        try {
            const payload = { ...formData };
            if (!payload.studentId) delete payload.studentId;

            if (editingUser) {
                if (!payload.password) delete payload.password;
                await api.put(`/users/${editingUser._id}`, payload);
                toast.success(`User "${formData.name}" updated successfully`);
            } else {
                if (!payload.password) {
                    toast.warning('Password is required for new users');
                    return;
                }
                await api.post('/users', payload);
                toast.success(`User "${formData.name}" added successfully`);
            }
            setShowModal(false);
            fetchUsers();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to save user');
        }
    };

    // ...

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <h1>User Management</h1>
                    <p>Manage all system users and their roles</p>
                </div>
                <div className="header-actions">
                    <button className="btn btn-primary" style={{ border: 'none' }} onClick={openAddModal}>
                        <FiPlus size={18} /> Add User
                    </button>
                </div>
            </div>

            <div className="role-stats">
                <div className="role-stat admin"><span className="count">{roleCounts.admin}</span><span className="label">Admins</span></div>
                <div className="role-stat faculty"><span className="count">{roleCounts.faculty}</span><span className="label">Faculty</span></div>
                <div className="role-stat student"><span className="count">{roleCounts.student}</span><span className="label">Students</span></div>
                <div className="role-stat parent"><span className="count">{roleCounts.parent}</span><span className="label">Parents</span></div>
            </div>

            <div className="filters-bar">
                <div className="search-box">
                    <FiSearch className="search-icon" />
                    <input type="text" placeholder="Search users..." value={searchTerm} onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }} />
                </div>
                <div className="filter-group">
                    <FiFilter className="filter-icon" />
                    <select value={selectedRole} onChange={e => { setSelectedRole(e.target.value); setCurrentPage(1); }}>
                        <option value="">All Roles</option>
                        <option value="ADMIN">Admin</option>
                        <option value="FACULTY">Faculty</option>
                        <option value="STUDENT">Student</option>
                        <option value="PARENT">Parent</option>
                    </select>
                </div>
            </div>

            <p className="results-info">Showing {filteredUsers.length} users</p>

            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedUsers.length === 0 ? (
                            <tr><td colSpan="5" className="empty-state">No users found</td></tr>
                        ) : paginatedUsers.map(u => (
                            <tr key={u._id}>
                                <td>
                                    <div className="user-cell">
                                        <div className="user-avatar-sm">{u.name.charAt(0)}</div>
                                        <span>{u.name}</span>
                                    </div>
                                </td>
                                <td><span className="email-cell"><FiMail size={14} /> {u.email}</span></td>
                                <td><span className={`role-badge role-${u.role.toLowerCase()}`}>{u.role}</span></td>
                                <td><span className="status-badge active">Active</span></td>
                                <td>
                                    <div className="table-actions">
                                        <button className="action-btn edit" onClick={() => openEditModal(u)} title="Edit"><FiEdit2 size={14} /></button>
                                        <button className="action-btn delete" onClick={() => confirmDelete(u)} title="Delete"><FiTrash2 size={14} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Pagination currentPage={currentPage} totalItems={filteredUsers.length} itemsPerPage={itemsPerPage} onPageChange={setCurrentPage} />

            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingUser ? 'Edit User' : 'Add New User'}>
                <div className="modal-form">
                    <div className="modal-form-row">
                        <div className="form-group">
                            <label>Full Name *</label>
                            <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Enter full name" />
                        </div>
                        <div className="form-group">
                            <label>Email *</label>
                            <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="Enter email" />
                        </div>
                    </div>
                    <div className="modal-form-row">
                        <div className="form-group">
                            <label>Role</label>
                            <select value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}>
                                <option value="ADMIN">Admin</option>
                                <option value="FACULTY">Faculty</option>
                                <option value="STUDENT">Student</option>
                                <option value="PARENT">Parent</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Phone</label>
                            <input type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="Enter phone number" />
                        </div>
                    </div>

                    {formData.role === 'PARENT' && (
                        <div className="form-group">
                            <label>Assign Student (Child)</label>
                            <select value={formData.studentId} onChange={e => setFormData({ ...formData, studentId: e.target.value })}>
                                <option value="">Select Student</option>
                                {students.map(s => <option key={s._id} value={s._id}>{s.name} ({s.rollNumber})</option>)}
                            </select>
                        </div>
                    )}

                    <div className="form-group">
                        <label>{editingUser ? 'New Password (leave blank to keep current)' : 'Password *'}</label>
                        <input type="password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} placeholder={editingUser ? 'Leave blank to keep current' : 'Enter password'} />
                    </div>
                    <div className="modal-actions">
                        <button className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                        <button className="btn-save" onClick={handleSave}>{editingUser ? 'Update' : 'Add'} User</button>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Confirm Delete" size="sm">
                <div className="confirm-dialog">
                    <div className="confirm-icon"><FiAlertTriangle size={28} /></div>
                    <h3>Delete User?</h3>
                    <p>Are you sure you want to delete <strong>{deleteTarget?.name}</strong>? This action cannot be undone.</p>
                    <div className="confirm-actions">
                        <button className="btn-cancel" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                        <button className="btn-danger" onClick={handleDelete}>Delete</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default UsersPage;
