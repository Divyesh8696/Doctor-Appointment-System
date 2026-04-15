import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { appointmentService } from '../services/appointmentService';
import './ProviderAppointments.css';

function ProviderAppointments() {
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        fetchAppointments();
    }, [statusFilter]);

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            const params = statusFilter !== 'all' ? { status: statusFilter } : {};
            const data = await appointmentService.getProviderBookings(params);
            if (data.success) {
                setAppointments(data.data);
            }
        } catch (err) {
            setError('Failed to load appointments. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await appointmentService.updateStatus(id, newStatus);
            // Refresh list
            fetchAppointments();
        } catch (err) {
            alert('Failed to update status');
            console.error(err);
        }
    };

    const handleStatusChange = (e) => {
        setStatusFilter(e.target.value);
    };

    const formatDate = (dateString) => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const formatTime = (timeString) => {
        // timeString is HH:MM (24h)
        const [hours, minutes] = timeString.split(':');
        const h = parseInt(hours, 10);
        const ampm = h >= 12 ? 'PM' : 'AM';
        const h12 = h % 12 || 12;
        return `${h12}:${minutes} ${ampm}`;
    };

    if (loading && appointments.length === 0) return <div className="loading">Loading bookings...</div>;

    return (
        <div className="provider-appointments-container">
            <div className="appointments-header">
                <h1>📋 My Bookings</h1>
                <div className="filter-controls">
                    <select
                        value={statusFilter}
                        onChange={handleStatusChange}
                        className="status-filter"
                    >
                        <option value="all">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="rejected">Rejected</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            {appointments.length === 0 ? (
                <div className="no-appointments">
                    <h3>No appointments found.</h3>
                    <p>When patients book your services, they will appear here.</p>
                </div>
            ) : (
                <div className="appointments-grid">
                    {appointments.map((appt) => (
                        <div key={appt._id} className={`appointment-card status-${appt.status}`}>
                            <div className="card-header">
                                <div className="patient-info">
                                    <h3>{appt.userId?.name || 'Unknown Patient'}</h3>
                                    <div className="service-name">{appt.serviceId?.name || 'Unknown Service'}</div>
                                </div>
                                <span className={`status-badge ${appt.status}`}>
                                    {appt.status}
                                </span>
                            </div>

                            <div className="appointment-details">
                                <div className="detail-row">
                                    <span className="dict-icon">📅</span>
                                    <span>{formatDate(appt.date)}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="dict-icon">⏰</span>
                                    <strong>{formatTime(appt.time)}</strong>
                                </div>
                                <div className="detail-row">
                                    <span className="dict-icon">📞</span>
                                    <span>{appt.userId?.phone || 'No phone'}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="dict-icon">📧</span>
                                    <span>{appt.userId?.email || 'No email'}</span>
                                </div>
                            </div>

                            {appt.notes && (
                                <div className="notes-section">
                                    <strong>Notes:</strong> {appt.notes}
                                </div>
                            )}

                            {appt.status === 'pending' && (
                                <div className="card-actions">
                                    <button
                                        className="btn-sm btn-confirm"
                                        onClick={() => handleStatusUpdate(appt._id, 'confirmed')}
                                    >
                                        ✅ Approve
                                    </button>
                                    <button
                                        className="btn-sm btn-cancel"
                                        onClick={() => handleStatusUpdate(appt._id, 'rejected')}
                                        style={{ backgroundColor: '#e74c3c' }} /* Override if needed */
                                    >
                                        ❌ Reject
                                    </button>
                                </div>
                            )}

                            {appt.status === 'confirmed' && (
                                <div className="card-actions">
                                    <button
                                        className="btn-sm btn-complete"
                                        onClick={() => handleStatusUpdate(appt._id, 'completed')}
                                    >
                                        🏁 Mark Complete
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ProviderAppointments;
