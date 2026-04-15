import React, { useEffect, useState } from 'react';
import adminService from '../services/adminService';

function AdminStats() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await adminService.getStats();
                setStats(data.data); // data.data because standard response { success: true, data: ... }
            } catch (err) {
                setError('Failed to fetch statistics');
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <div className="loading">Loading Statistics...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="card">
            <h2>System Statistics</h2>
            <div className="stats-grid">
                <div className="stat-card">
                    <h3>Total Users</h3>
                    <p>{stats.totalUsers}</p>
                </div>
                <div className="stat-card">
                    <h3>Active Users</h3>
                    <p>{stats.activeUsers}</p>
                </div>
                <div className="stat-card">
                    <h3>Total Providers</h3>
                    <p>{stats.totalProviders}</p>
                </div>
                <div className="stat-card">
                    <h3>Total Appointments</h3>
                    <p>{stats.totalAppointments}</p>
                </div>
                <div className="stat-card">
                    <h3>Active Appointments</h3>
                    <p>{stats.activeAppointments}</p>
                </div>
            </div>

            <style>{`
                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 1.5rem;
                    margin-top: 1.5rem;
                }
                .stat-card {
                    background: #f8f9fa;
                    padding: 1.5rem;
                    border-radius: 8px;
                    text-align: center;
                    border: 1px solid #e9ecef;
                }
                .stat-card h3 {
                    font-size: 1rem;
                    color: #6c757d;
                    margin-bottom: 0.5rem;
                }
                .stat-card p {
                    font-size: 2rem;
                    font-weight: 700;
                    color: var(--primary-color);
                    margin: 0;
                }
            `}</style>
        </div>
    );
}

export default AdminStats;
