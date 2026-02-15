import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/common/Toast';
import { FiUser, FiMail, FiPhone, FiSave, FiCamera, FiShield, FiCalendar } from 'react-icons/fi';
import '../Pages.css';

const ProfilePage = () => {
    const { user } = useAuth();
    const toast = useToast();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        department: '',
        bio: ''
    });
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                department: user.department || '',
                bio: user.bio || 'No bio provided.'
            });
        }
    }, [user]);

    const handleSave = () => {
        setEditing(false);
        toast.success('Profile updated successfully!');
    };

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <h1>My Profile</h1>
                    <p>Manage your personal information and preferences</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem' }}>
                {/* Profile Card */}
                <div className="dashboard-card" style={{ textAlign: 'center', padding: '2rem', alignSelf: 'start' }}>
                    <div style={{
                        width: 100, height: 100,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: '50%', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', margin: '0 auto 1rem',
                        color: 'white', fontSize: '2.5rem', fontWeight: 700
                    }}>
                        {user?.name?.charAt(0) || '?'}
                    </div>
                    <h2 style={{ marginBottom: '0.25rem' }}>{user?.name}</h2>
                    <span className={`role-badge role-${user?.role?.toLowerCase()}`}>{user?.role}</span>
                    <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', textAlign: 'left' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#666', fontSize: '0.9rem' }}>
                            <FiMail size={16} /> {user?.email}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#666', fontSize: '0.9rem' }}>
                            <FiPhone size={16} /> {user?.phone || 'Not provided'}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#666', fontSize: '0.9rem' }}>
                            <FiShield size={16} /> Role: {user?.role}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#666', fontSize: '0.9rem' }}>
                            <FiCalendar size={16} /> Joined: Jan 2024
                        </div>
                    </div>
                </div>

                {/* Edit Form */}
                <div className="dashboard-card" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h2>Personal Information</h2>
                        {!editing ? (
                            <button className="btn btn-primary" style={{ border: 'none' }} onClick={() => setEditing(true)}>
                                Edit Profile
                            </button>
                        ) : (
                            <button className="btn btn-primary" style={{ border: 'none' }} onClick={handleSave}>
                                <FiSave size={16} /> Save Changes
                            </button>
                        )}
                    </div>
                    <div className="modal-form">
                        <div className="modal-form-row">
                            <div className="form-group">
                                <label>Full Name</label>
                                <input
                                    type="text" value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    disabled={!editing}
                                />
                            </div>
                            <div className="form-group">
                                <label>Email Address</label>
                                <input type="email" value={formData.email} disabled />
                            </div>
                        </div>
                        <div className="modal-form-row">
                            <div className="form-group">
                                <label>Phone Number</label>
                                <input
                                    type="tel" value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    disabled={!editing}
                                />
                            </div>
                            <div className="form-group">
                                <label>Department</label>
                                <input
                                    type="text" value={formData.department}
                                    onChange={e => setFormData({ ...formData, department: e.target.value })}
                                    disabled={!editing}
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Bio</label>
                            <textarea
                                value={formData.bio}
                                onChange={e => setFormData({ ...formData, bio: e.target.value })}
                                disabled={!editing}
                                rows={3}
                                style={{ padding: '0.7rem 1rem', border: '2px solid #e9ecef', borderRadius: '10px', fontSize: '0.9rem', background: editing ? 'white' : '#f8f9fa', fontFamily: 'inherit', resize: 'vertical' }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
