import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import './Dashboard.css';

function Dashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const currentUser = authService.getCurrentUser();
        if (!currentUser) {
            navigate('/login');
        } else {
            setUser(currentUser);
        }
    }, [navigate]);

    if (!user) return <div className="loading">Loading...</div>;

    return (
        <div className="dashboard-container">
            <h1>Welcome, {user.name}!</h1>
            <p className="user-role">Role: <span className="badge">{user.role.toUpperCase()}</span></p>

            <div className="dashboard-grid">
                {user.role === 'user' && (
                    <>
                        <div className="dashboard-card" onClick={() => navigate('/services')}>
                            <h3>🔍 Browse Services</h3>
                            <p>Find and book services</p>
                        </div>
                        <div className="dashboard-card" onClick={() => navigate('/my-appointments')}>
                            <h3>📅 My Appointments</h3>
                            <p>View your bookings</p>
                        </div>
                    </>
                )}

                {user.role === 'provider' && (
                    <>
                        <div className="dashboard-card" onClick={() => navigate('/my-services')}>
                            <h3>💼 My Services</h3>
                            <p>Manage your services</p>
                        </div>
                        <div className="dashboard-card" onClick={() => navigate('/my-bookings')}>
                            <h3>📋 My Bookings</h3>
                            <p>View customer bookings</p>
                        </div>
                        <div className="dashboard-card" onClick={() => navigate('/services')}>
                            <h3>🔍 Browse Services</h3>
                            <p>View all services</p>
                        </div>
                    </>
                )}

                {user.role === 'admin' && (
                    <>
                        <div className="dashboard-card" onClick={() => navigate('/admin/users')}>
                            <h3>👥 Manage Users</h3>
                            <p>User administration</p>
                        </div>
                        <div className="dashboard-card" onClick={() => navigate('/admin/stats')}>
                            <h3>📊 Statistics</h3>
                            <p>System overview</p>
                        </div>
                        <div className="dashboard-card" onClick={() => navigate('/admin/audit-logs')}>
                            <h3>📜 Audit Logs</h3>
                            <p>View system logs</p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default Dashboard;
