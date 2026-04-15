import React, { useEffect, useState } from 'react';
import { appointmentService } from '../services/appointmentService';
import './MyAppointments.css';

function MyAppointments() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('');

    useEffect(() => {
        fetchAppointments();
    }, [filter]);

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            const params = filter ? { status: filter } : {};
            const data = await appointmentService.getAll(params);
            setAppointments(data.data);
        } catch (err) {
            setError('Failed to load appointments');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (id) => {
        if (!window.confirm('Are you sure you want to cancel this appointment?')) return;

        const reason = prompt('Please provide a cancellation reason:');
        if (!reason) return;

        try {
            await appointmentService.cancel(id, reason);
            fetchAppointments();
            alert('Appointment cancelled successfully');
        } catch (err) {
            const errorMsg = err.response?.data?.error || 'Failed to cancel appointment';
            alert(errorMsg);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const getStatusClass = (status) => {
        const classes = {
            pending: 'status-pending',
            confirmed: 'status-confirmed',
            completed: 'status-completed',
            cancelled: 'status-cancelled',
        };
        return classes[status] || '';
    };

    if (loading) return <div className="loading">Loading appointments...</div>;

    return (
        <div className="appointments-container">
            <h1>My Appointments</h1>

            <div className="filters">
                <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                    <option value="">All Appointments</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="appointments-list">
                {appointments.length === 0 ? (
                    <p className="no-data">No appointments found</p>
                ) : (
                    appointments.map((appointment) => (
                        <div key={appointment._id} className="appointment-card">
                            <div className="appointment-header">
                                <h3>{appointment.serviceId?.name}</h3>
                                <span className={`status-badge ${getStatusClass(appointment.status)}`}>
                                    {appointment.status.toUpperCase()}
                                </span>
                            </div>

                            <div className="appointment-details">
                                <p><strong>👨‍⚕️ Doctor:</strong> {appointment.providerId?.name}</p>
                                <p><strong>📅 Date:</strong> {formatDate(appointment.date)}</p>
                                <p><strong>🕐 Time:</strong> {appointment.time}</p>
                                <p><strong>⏱️ Duration:</strong> {appointment.serviceId?.duration} minutes</p>
                                {appointment.notes && (
                                    <p><strong>📝 Notes:</strong> {appointment.notes}</p>
                                )}
                                {appointment.cancelReason && (
                                    <p className="cancel-reason">
                                        <strong>❌ Cancellation Reason:</strong> {appointment.cancelReason}
                                    </p>
                                )}
                            </div>

                            {appointment.status === 'pending' && (
                                <div className="appointment-actions">
                                    <button
                                        className="btn-danger"
                                        onClick={() => handleCancel(appointment._id)}
                                    >
                                        Cancel Appointment
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default MyAppointments;
