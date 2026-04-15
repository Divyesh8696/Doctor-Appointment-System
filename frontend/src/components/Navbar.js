import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/authService';
import './Navbar.css';

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const user = authService.getCurrentUser();
    const isAuthenticated = authService.isAuthenticated();

    const isAuthPage = ['/login', '/register'].includes(location.pathname);

    const handleLogout = async () => {
        await authService.logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="nav-container">
                <Link to="/" className="nav-logo">
                    🏥 Doctor Appointment System
                </Link>

                <div className="nav-menu">
                    {isAuthenticated ? (
                        <>
                            <Link to="/dashboard" className="nav-link">Dashboard</Link>
                            <Link to="/services" className="nav-link">Find Doctors</Link>

                            {user?.role === 'user' && (
                                <Link to="/my-appointments" className="nav-link">My Appointments</Link>
                            )}

                            {user?.role === 'provider' && (
                                <>
                                    <Link to="/my-services" className="nav-link">My Services</Link>
                                    <Link to="/my-bookings" className="nav-link">My Bookings</Link>
                                </>
                            )}

                            {user?.role === 'admin' && (
                                <Link to="/admin/users" className="nav-link">Admin Panel</Link>
                            )}

                            <span className="nav-user">👤 {user?.name}</span>
                            <button onClick={handleLogout} className="btn-logout">Logout</button>
                        </>
                    ) : (
                        !isAuthPage && (
                            <>
                                <Link to="/login" className="nav-link">Login</Link>
                                <Link to="/register" className="btn-register">Register</Link>
                            </>
                        )
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
