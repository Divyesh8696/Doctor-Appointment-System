import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { serviceService } from '../services/serviceService';
import './Services.css';

function Services() {
    const navigate = useNavigate();
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');

    useEffect(() => {
        fetchServices();
    }, [category]);

    const fetchServices = async () => {
        try {
            setLoading(true);
            const params = {};
            if (category) params.category = category;
            if (search) params.search = search;

            const data = await serviceService.getAll(params);
            setServices(data.data);
        } catch (err) {
            setError('Failed to load services');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchServices();
    };

    const handleBookNow = (serviceId) => {
        navigate(`/book-appointment/${serviceId}`);
    };

    if (loading) return <div className="loading">Loading services...</div>;

    return (
        <div className="services-container">
            <h1>Available Services</h1>

            <div className="filters">
                <form onSubmit={handleSearch} className="search-form">
                    <input
                        type="text"
                        placeholder="Search services..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button type="submit">Search</button>
                </form>

                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="">All Categories</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Beauty">Beauty</option>
                    <option value="Consulting">Consulting</option>
                    <option value="Repair">Repair</option>
                    <option value="Education">Education</option>
                    <option value="Other">Other</option>
                </select>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="services-grid">
                {services.length === 0 ? (
                    <p className="no-data">No services found</p>
                ) : (
                    services.map((service) => (
                        <div key={service._id} className="service-card">
                            <div className="service-header">
                                <h3>{service.name}</h3>
                                <span className="category-badge">{service.category}</span>
                            </div>
                            <p className="service-description">{service.description}</p>
                            <div className="service-details">
                                <span>⏱️ {service.duration} minutes</span>
                                <span>👤 {service.providerId?.name}</span>
                            </div>
                            <button className="btn-primary" onClick={() => handleBookNow(service._id)}>
                                Book Now
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default Services;
