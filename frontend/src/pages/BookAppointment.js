import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { serviceService } from '../services/serviceService';
import { appointmentService } from '../services/appointmentService';
import './BookAppointment.css';

function BookAppointment() {
    const { serviceId } = useParams();
    const navigate = useNavigate();
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [formData, setFormData] = useState({
        date: '',
        time: '',
        notes: '',
    });

    useEffect(() => {
        fetchService();
    }, [serviceId]);

    const fetchService = async () => {
        try {
            const data = await serviceService.getById(serviceId);
            setService(data.data);
        } catch (err) {
            setError('Failed to load service details');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            await appointmentService.book({
                serviceId,
                ...formData,
            });
            setSuccess(`Appointment booked successfully for ${formData.date} at ${formData.time}`);
            setTimeout(() => {
                navigate('/my-appointments');
            }, 3000);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to book appointment');
        }
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (!service) return <div className="error-message">Service not found</div>;

    // Get tomorrow's date as minimum
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0];

    return (
        <div className="book-appointment-container">
            <div className="book-card">
                <h2>Book Appointment</h2>

                <div className="service-info">
                    <h3>{service.name}</h3>
                    <p className="service-category">🏥 {service.category}</p>
                    <p>{service.description}</p>
                    <div className="service-meta">
                        <span>⏱️ Duration: {service.duration} minutes</span>
                        <span>👨‍⚕️ Doctor: {service.providerId?.name}</span>
                    </div>
                </div>

                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Appointment Date</label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            min={minDate}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Appointment Time</label>
                        <input
                            type="time"
                            name="time"
                            value={formData.time}
                            onChange={handleChange}
                            required
                        />
                        <small>Available hours: 9:00 AM - 5:00 PM</small>
                    </div>

                    <div className="form-group">
                        <label>Notes (Optional)</label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            placeholder="Any specific symptoms or requirements..."
                            rows="4"
                        />
                    </div>

                    <div className="button-group">
                        <button type="button" className="btn-secondary" onClick={() => navigate('/services')}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary">
                            Confirm Booking
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default BookAppointment;
