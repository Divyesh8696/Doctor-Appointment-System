import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import './Auth.css';

function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        role: 'user',
        consent: false,
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await authService.register(formData);
            navigate('/dashboard');
        } catch (err) {
            console.error('Registration Error:', err);
            let errorMsg = 'Registration failed';

            if (err.response) {
                // Server responded with a status code outside 2xx range
                if (err.response.data) {
                    if (err.response.data.error) {
                        errorMsg = err.response.data.error;
                    } else if (err.response.data.errors && Array.isArray(err.response.data.errors)) {
                        errorMsg = err.response.data.errors[0].message;
                    } else {
                        errorMsg = `Server error: ${err.response.status}`;
                    }
                } else {
                    errorMsg = `Server error: ${err.response.status}`;
                }
            } else if (err.request) {
                // Request was made but no response was received
                errorMsg = 'No response from server. Please check your internet connection or if the server is running.';
            } else {
                // Something happened in setting up the request
                errorMsg = err.message;
            }

            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Register</h2>
                <p className="auth-subtitle">Create your account</p>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Enter your full name"
                        />
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="Enter your email"
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="Min 8 chars, uppercase, lowercase, number, special char"
                        />
                        <small>Must contain uppercase, lowercase, number, and special character</small>
                    </div>

                    <div className="form-group">
                        <label>Phone Number</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            placeholder="10-digit phone number"
                            pattern="[0-9]{10}"
                        />
                    </div>

                    <div className="form-group">
                        <label>Register as</label>
                        <select name="role" value={formData.role} onChange={handleChange}>
                            <option value="user">User (Book Services)</option>
                            <option value="provider">Service Provider (Doctor)</option>
                        </select>
                    </div>

                    {formData.role === 'provider' && (
                        <div className="form-group">
                            <label>Hospital / Clinic Name</label>
                            <input
                                type="text"
                                name="hospitalName"
                                value={formData.hospitalName || ''}
                                onChange={handleChange}
                                required
                                placeholder="Enter your hospital or clinic name"
                            />
                        </div>
                    )}

                    <div className="form-group checkbox-group">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                name="consent"
                                checked={formData.consent}
                                onChange={handleChange}
                                required
                            />
                            <span>I consent to the collection and processing of my personal data for the purpose of booking and managing appointments as per the DPDP Act.</span>
                        </label>
                    </div>

                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                </form>

                <p className="auth-footer">
                    Already have an account? <Link to="/login">Login here</Link>
                </p>
            </div>
        </div>
    );
}

export default Register;
