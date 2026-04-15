import React, { useEffect, useState } from 'react';
import adminService from '../services/adminService';

function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchUsers = async () => {
        try {
            const data = await adminService.getUsers();
            setUsers(data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleActivate = async (id) => {
        if (!window.confirm('Are you sure you want to activate this user?')) return;
        try {
            await adminService.activateUser(id);
            alert('User Activated');
            fetchUsers();
        } catch (err) {
            alert('Failed to activate user');
        }
    };

    const handleDeactivate = async (id) => {
        if (!window.confirm('Are you sure you want to deactivate this user?')) return;
        try {
            await adminService.deactivateUser(id);
            alert('User Deactivated');
            fetchUsers();
        } catch (err) {
            alert('Failed to deactivate user');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to DELETE this user permanently?')) return;
        try {
            await adminService.deleteUser(id);
            alert('User Deleted');
            fetchUsers();
        } catch (err) {
            alert('Failed to delete user');
        }
    };

    const handleRoleChange = async (id, newRole) => {
        if (!window.confirm(`Change role to ${newRole}?`)) return;
        try {
            await adminService.changeRole(id, newRole);
            alert('Role Updated');
            fetchUsers();
        } catch (err) {
            alert('Failed to change role');
        }
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="loading">Loading Users...</div>;

    return (
        <div className="card">
            <div className="flex-header">
                <h2>Manage Users</h2>
                <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
            </div>

            <div className="table-responsive">
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(user => (
                            <tr key={user._id}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>
                                    <select
                                        value={user.role}
                                        onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                        className="role-select"
                                    >
                                        <option value="user">User</option>
                                        <option value="provider">Provider</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </td>
                                <td>
                                    <span className={`badge ${user.isActive ? 'badge-success' : 'badge-danger'}`}>
                                        {user.isActive ? 'Active' : 'Deactivated'}
                                    </span>
                                </td>
                                <td>
                                    <div className="action-buttons">
                                        {user.isActive ? (
                                            <button
                                                onClick={() => handleDeactivate(user._id)}
                                                className="btn-danger btn-sm"
                                            >
                                                Block
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleActivate(user._id)}
                                                className="btn-success btn-sm"
                                            >
                                                Activate
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDelete(user._id)}
                                            className="btn-danger btn-sm"
                                            title="Delete User"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <style>{`
                .flex-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1.5rem;
                }
                .search-input {
                    padding: 0.5rem;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    width: 250px;
                }
                .table-responsive {
                    overflow-x: auto;
                }
                .users-table {
                    width: 100%;
                    border-collapse: collapse;
                }
                .users-table th, .users-table td {
                    padding: 1rem;
                    border-bottom: 1px solid #eee;
                    text-align: left;
                }
                .users-table th {
                    background-color: #f8f9fa;
                    font-weight: 600;
                    color: var(--text-light);
                }
                .role-select {
                    padding: 0.3rem;
                    border-radius: 4px;
                    border: 1px solid #ddd;
                }
                .badge {
                    padding: 0.25rem 0.5rem;
                    border-radius: 4px;
                    font-size: 0.85rem;
                    font-weight: 600;
                }
                .badge-success { background: #d4edda; color: #155724; }
                .badge-danger { background: #f8d7da; color: #721c24; }
                .action-buttons {
                    display: flex;
                    gap: 0.5rem;
                }
                .btn-sm {
                    padding: 0.25rem 0.5rem;
                    font-size: 0.85rem;
                }
            `}</style>
        </div>
    );
}

export default AdminUsers;
