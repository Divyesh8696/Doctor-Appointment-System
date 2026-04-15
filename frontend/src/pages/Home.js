import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
    return (
        <div className="home-container">
            <nav className="home-nav">
                <div className="home-logo">🏥 Appointment System</div>
                <div className="home-links">
                    <Link to="/login" className="btn-nav">Login</Link>
                    <Link to="/register" className="btn-nav btn-register-nav">Register</Link>
                </div>
            </nav>

            <header className="home-hero">
                <h1>Secure Doctor Appointment System</h1>
                <p>Connect with top healthcare professionals securely and efficiently. Manage your health journey with confidence.</p>
                <div className="hero-buttons">
                    <Link to="/login" className="btn-secondary btn-lg">Login</Link>
                    <Link to="/register" className="btn-primary btn-lg">Sign Up</Link>
                </div>
            </header>

            <section className="features-grid">
                <div className="feature-card">
                    <div className="icon">🩺</div>
                    <h3>For Patients</h3>
                    <p>Find the best doctors near you, view real-time availability, and book appointments in seconds. No more waiting.</p>
                </div>
                <div className="feature-card">
                    <div className="icon">📅</div>
                    <h3>For Doctors</h3>
                    <p>Streamline your practice with a dedicated dashboard. Manage availability, approve bookings, and track patient history effortlessly.</p>
                </div>
            </section>



            <footer className="home-footer">
                <p>&copy; 2026 Secure Appointment System.</p>
            </footer>
        </div>
    );
}

export default Home;
