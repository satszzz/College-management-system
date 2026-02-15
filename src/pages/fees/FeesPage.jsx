import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/common/Toast';
import api from '../../services/api';
import Modal from '../../components/common/Modal';
import Pagination from '../../components/common/Pagination';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import { FiSearch, FiFilter, FiDollarSign, FiCheckCircle, FiClock, FiAlertTriangle } from 'react-icons/fi';
import '../Pages.css';

const FeesPage = () => {
    const { user } = useAuth();
    const toast = useToast();

    const [fees, setFees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const [showPayModal, setShowPayModal] = useState(false);
    const [payTarget, setPayTarget] = useState(null);

    useEffect(() => { fetchFees(); }, []);

    const fetchFees = async () => {
        try {
            setLoading(true);
            let url = '/fees';

            if (user?.role === 'STUDENT') {
                const { data: students } = await api.get(`/students?userId=${user.id}`);
                if (students.length > 0) {
                    url = `/fees?studentId=${students[0]._id}`;
                } else {
                    setFees([]);
                    return;
                }
            } else if (user?.role === 'PARENT') {
                if (user.studentId) {
                    url = `/fees?studentId=${user.studentId}`;
                } else {
                    setFees([]);
                    return;
                }
            }

            const { data } = await api.get(url);
            setFees(data);
        } catch (err) {
            console.error(err);
            toast.error('Failed to load fees');
        } finally {
            setLoading(false);
        }
    };

    const filteredFees = useMemo(() => {
        return fees.filter(fee => {
            const studentName = fee.studentId?.name || '';
            const matchesSearch = !searchTerm ||
                studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                fee.type.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = !selectedStatus || fee.status === selectedStatus;
            return matchesSearch && matchesStatus;
        });
    }, [fees, searchTerm, selectedStatus]);

    const paginatedFees = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredFees.slice(start, start + itemsPerPage);
    }, [filteredFees, currentPage]);

    const summary = useMemo(() => {
        const total = fees.reduce((sum, f) => sum + f.amount, 0);
        const paid = fees.filter(f => f.status === 'PAID').reduce((sum, f) => sum + f.amount, 0);
        const pending = fees.filter(f => f.status === 'PENDING').reduce((sum, f) => sum + f.amount, 0);
        const overdue = fees.filter(f => f.status === 'OVERDUE').reduce((sum, f) => sum + f.amount, 0);
        return { total, paid, pending, overdue };
    }, [fees]);

    const openPayModal = (fee) => { setPayTarget(fee); setShowPayModal(true); };

    const handlePay = async () => {
        try {
            await api.put(`/fees/${payTarget._id}`, {
                status: 'PAID',
                paidDate: new Date().toISOString().split('T')[0]
            });
            toast.success(`Payment of ₹${payTarget.amount.toLocaleString()} successful!`);
            setShowPayModal(false);
            fetchFees();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Payment failed');
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'PAID': return <FiCheckCircle />;
            case 'PENDING': return <FiClock />;
            case 'OVERDUE': return <FiAlertTriangle />;
            default: return null;
        }
    };

    if (loading) return <div className="page"><SkeletonLoader type="table" count={5} /></div>;

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <h1>{user?.role === 'STUDENT' ? 'My Fees' : user?.role === 'PARENT' ? "Child's Fee Status" : 'Fee Management'}</h1>
                    <p>Track fee payments and outstanding balances</p>
                </div>
            </div>

            <div className="fee-summary-grid">
                <div className="fee-summary-card total">
                    <div className="icon-wrapper"><FiDollarSign size={24} /></div>
                    <div className="content"><span className="label">Total Fees</span><span className="value">₹{summary.total.toLocaleString()}</span></div>
                </div>
                <div className="fee-summary-card paid">
                    <div className="icon-wrapper"><FiCheckCircle size={24} /></div>
                    <div className="content"><span className="label">Paid</span><span className="value">₹{summary.paid.toLocaleString()}</span></div>
                </div>
                <div className="fee-summary-card pending">
                    <div className="icon-wrapper"><FiClock size={24} /></div>
                    <div className="content"><span className="label">Pending</span><span className="value">₹{summary.pending.toLocaleString()}</span></div>
                </div>
                <div className="fee-summary-card overdue">
                    <div className="icon-wrapper"><FiAlertTriangle size={24} /></div>
                    <div className="content"><span className="label">Overdue</span><span className="value">₹{summary.overdue.toLocaleString()}</span></div>
                </div>
            </div>

            {summary.total > 0 && (
                <div className="payment-progress-card">
                    <h3>Payment Progress</h3>
                    <div className="progress-bar-container">
                        <div className="progress-bar" style={{ width: `${(summary.paid / summary.total) * 100}%` }}></div>
                    </div>
                    <div className="progress-info">
                        <span>₹{summary.paid.toLocaleString()} paid</span>
                        <span>{((summary.paid / summary.total) * 100).toFixed(0)}% complete</span>
                    </div>
                </div>
            )}

            <div className="filters-bar" style={{ marginTop: '1.5rem' }}>
                <div className="search-box">
                    <FiSearch className="search-icon" />
                    <input type="text" placeholder="Search fees..." value={searchTerm} onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }} />
                </div>
                <div className="filter-group">
                    <FiFilter className="filter-icon" />
                    <select value={selectedStatus} onChange={e => { setSelectedStatus(e.target.value); setCurrentPage(1); }}>
                        <option value="">All Status</option>
                        <option value="PAID">Paid</option>
                        <option value="PENDING">Pending</option>
                        <option value="OVERDUE">Overdue</option>
                    </select>
                </div>
            </div>

            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            {(user?.role !== 'STUDENT' && user?.role !== 'PARENT') && <th>Student</th>}
                            <th>Fee Type</th>
                            <th>Amount</th>
                            <th>Due Date</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedFees.length === 0 ? (
                            <tr><td colSpan="6" className="empty-state">No fee records found</td></tr>
                        ) : paginatedFees.map(fee => (
                            <tr key={fee._id}>
                                {(user?.role !== 'STUDENT' && user?.role !== 'PARENT') && <td>{fee.studentId?.name || 'Unknown'}</td>}
                                <td>{fee.type}</td>
                                <td className="amount-cell">₹{fee.amount.toLocaleString()}</td>
                                <td>{fee.dueDate}</td>
                                <td>
                                    <span className={`status-pill ${fee.status.toLowerCase()}`}>
                                        <span className="status-icon">{getStatusIcon(fee.status)}</span>
                                        {fee.status}
                                    </span>
                                </td>
                                <td>
                                    {fee.status !== 'PAID' ? (
                                        <button className="btn-primary-sm" onClick={() => openPayModal(fee)}>Pay Now</button>
                                    ) : (
                                        <span style={{ color: '#37b24d', fontSize: '0.85rem' }}>✓ Paid</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Pagination currentPage={currentPage} totalItems={filteredFees.length} itemsPerPage={itemsPerPage} onPageChange={setCurrentPage} />

            <Modal isOpen={showPayModal} onClose={() => setShowPayModal(false)} title="Confirm Payment" size="sm">
                <div className="confirm-dialog">
                    <div className="confirm-icon" style={{ background: 'rgba(102,126,234,0.1)', color: '#667eea' }}>
                        <FiDollarSign size={28} />
                    </div>
                    <h3>Confirm Payment</h3>
                    <p>Pay <strong>₹{payTarget?.amount?.toLocaleString()}</strong> for <strong>{payTarget?.type}</strong>?</p>
                    <div className="confirm-actions">
                        <button className="btn-cancel" onClick={() => setShowPayModal(false)}>Cancel</button>
                        <button className="btn-save" onClick={handlePay}>Pay Now</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default FeesPage;
