import React, { useEffect, useState } from 'react';
import adminService from '../services/adminService';

function AdminAuditLogs() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const data = await adminService.getAuditLogs();
                setLogs(data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchLogs();
    }, []);

    if (loading) return <div className="loading">Loading Logs...</div>;

    return (
        <div className="card">
            <h2>System Audit Logs</h2>
            <div className="logs-container">
                {logs.length === 0 ? (
                    <p>No logs found.</p>
                ) : (
                    <table className="logs-table">
                        <thead>
                            <tr>
                                <th>Timestamp</th>
                                <th>Action</th>
                                <th>User ID</th>
                                <th>Resource</th>
                                <th>IP Address</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map(log => (
                                <tr key={log._id}>
                                    <td>{new Date(log.createdAt).toLocaleString()}</td>
                                    <td><span className="badge badge-info">{log.action}</span></td>
                                    <td className="monospace">{log.userId ? log.userId.toString().substring(0, 8) + '...' : 'System'}</td>
                                    <td>{log.resourceType}</td>
                                    <td>{log.ipAddress}</td>
                                    <td>{log.description}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <style>{`
                .logs-container {
                    overflow-x: auto;
                    margin-top: 1rem;
                }
                .logs-table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 0.9rem;
                }
                .logs-table th, .logs-table td {
                    padding: 0.75rem;
                    border-bottom: 1px solid #eee;
                    text-align: left;
                }
                .logs-table th {
                    background-color: #f8f9fa;
                    font-weight: 600;
                    color: var(--text-light);
                }
                .badge-info {
                    background: #d1ecf1;
                    color: #0c5460;
                    padding: 0.2rem 0.5rem;
                    border-radius: 4px;
                    font-size: 0.8rem;
                }
                .monospace {
                    font-family: monospace;
                    color: #666;
                }
            `}</style>
        </div>
    );
}

export default AdminAuditLogs;
