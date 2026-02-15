import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FiClock, FiMapPin, FiBook, FiCalendar, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import '../Pages.css';

const SchedulePage = () => {
    const { user } = useAuth();

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const [selectedDay, setSelectedDay] = useState(0);

    const scheduleData = {
        Monday: [
            { time: '09:00 - 10:00', subject: 'Data Structures', code: 'CS201', room: 'Room 301', type: 'Lecture' },
            { time: '10:15 - 11:15', subject: 'Database Systems', code: 'CS301', room: 'Room 205', type: 'Lecture' },
            { time: '11:30 - 12:30', subject: 'Mathematics III', code: 'MA201', room: 'Room 102', type: 'Tutorial' },
            { time: '14:00 - 16:00', subject: 'Data Structures Lab', code: 'CS201L', room: 'Lab 4', type: 'Lab' },
        ],
        Tuesday: [
            { time: '09:00 - 10:00', subject: 'Operating Systems', code: 'CS401', room: 'Room 301', type: 'Lecture' },
            { time: '10:15 - 11:15', subject: 'Computer Networks', code: 'CS402', room: 'Room 302', type: 'Lecture' },
            { time: '14:00 - 16:00', subject: 'Database Lab', code: 'CS301L', room: 'Lab 2', type: 'Lab' },
        ],
        Wednesday: [
            { time: '09:00 - 10:00', subject: 'Data Structures', code: 'CS201', room: 'Room 301', type: 'Lecture' },
            { time: '10:15 - 11:15', subject: 'Database Systems', code: 'CS301', room: 'Room 205', type: 'Lecture' },
            { time: '11:30 - 12:30', subject: 'Operating Systems', code: 'CS401', room: 'Room 301', type: 'Tutorial' },
        ],
        Thursday: [
            { time: '09:00 - 10:00', subject: 'Computer Networks', code: 'CS402', room: 'Room 302', type: 'Lecture' },
            { time: '10:15 - 11:15', subject: 'Mathematics III', code: 'MA201', room: 'Room 102', type: 'Lecture' },
            { time: '14:00 - 16:00', subject: 'Network Lab', code: 'CS402L', room: 'Lab 3', type: 'Lab' },
        ],
        Friday: [
            { time: '09:00 - 10:00', subject: 'Data Structures', code: 'CS201', room: 'Room 301', type: 'Lecture' },
            { time: '10:15 - 11:15', subject: 'Operating Systems', code: 'CS401', room: 'Room 301', type: 'Lecture' },
            { time: '11:30 - 12:30', subject: 'Computer Networks', code: 'CS402', room: 'Room 302', type: 'Lecture' },
        ],
        Saturday: [
            { time: '09:00 - 11:00', subject: 'Project Work', code: 'CS499', room: 'Lab 5', type: 'Lab' },
        ],
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'Lecture': return { bg: 'rgba(102,126,234,0.1)', color: '#667eea', border: '#667eea' };
            case 'Lab': return { bg: 'rgba(81,207,102,0.1)', color: '#37b24d', border: '#37b24d' };
            case 'Tutorial': return { bg: 'rgba(253,126,20,0.1)', color: '#fd7e14', border: '#fd7e14' };
            default: return { bg: '#f8f9fa', color: '#666', border: '#e9ecef' };
        }
    };

    const currentSchedule = scheduleData[days[selectedDay]] || [];

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <h1>Schedule</h1>
                    <p>View your weekly class timetable</p>
                </div>
            </div>

            {/* Day Selector */}
            <div style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                marginBottom: '1.5rem', overflowX: 'auto'
            }}>
                <button
                    className="btn-action"
                    onClick={() => setSelectedDay(Math.max(0, selectedDay - 1))}
                    disabled={selectedDay === 0}
                >
                    <FiChevronLeft />
                </button>
                {days.map((day, idx) => (
                    <button
                        key={day}
                        className={`btn-action ${selectedDay === idx ? '' : ''}`}
                        onClick={() => setSelectedDay(idx)}
                        style={{
                            padding: '0.6rem 1.25rem',
                            background: selectedDay === idx ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#f1f3f4',
                            color: selectedDay === idx ? 'white' : '#666',
                            fontWeight: selectedDay === idx ? 600 : 400,
                            borderRadius: '10px',
                            border: 'none', cursor: 'pointer', transition: 'all 0.3s',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {day}
                    </button>
                ))}
                <button
                    className="btn-action"
                    onClick={() => setSelectedDay(Math.min(days.length - 1, selectedDay + 1))}
                    disabled={selectedDay === days.length - 1}
                >
                    <FiChevronRight />
                </button>
            </div>

            {/* Schedule Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {currentSchedule.length === 0 ? (
                    <div className="empty-state-box">
                        <FiCalendar size={48} />
                        <h3>No classes scheduled</h3>
                        <p>Enjoy your day off!</p>
                    </div>
                ) : (
                    currentSchedule.map((item, idx) => {
                        const typeStyle = getTypeColor(item.type);
                        return (
                            <div key={idx} style={{
                                display: 'flex', alignItems: 'center', gap: '1.5rem',
                                background: 'white', borderRadius: '16px', padding: '1.25rem 1.5rem',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                                borderLeft: `4px solid ${typeStyle.border}`,
                                transition: 'transform 0.2s'
                            }}>
                                <div style={{
                                    background: typeStyle.bg, color: typeStyle.color,
                                    padding: '0.6rem 1rem', borderRadius: '10px',
                                    fontWeight: 600, fontSize: '0.85rem', textAlign: 'center',
                                    minWidth: '120px', whiteSpace: 'nowrap'
                                }}>
                                    <FiClock size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                                    {item.time}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 600, fontSize: '1rem', color: '#1a1a2e', marginBottom: '0.25rem' }}>
                                        {item.subject}
                                    </div>
                                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: '#666' }}>
                                        <span><FiBook size={12} style={{ verticalAlign: 'middle' }} /> {item.code}</span>
                                        <span><FiMapPin size={12} style={{ verticalAlign: 'middle' }} /> {item.room}</span>
                                    </div>
                                </div>
                                <span style={{
                                    padding: '0.3rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem',
                                    fontWeight: 600, background: typeStyle.bg, color: typeStyle.color,
                                    textTransform: 'uppercase'
                                }}>
                                    {item.type}
                                </span>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default SchedulePage;
