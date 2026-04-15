import React, { useEffect, useState } from 'react';
import { serviceService } from '../services/serviceService';
import './ProviderServices.css';

function ProviderServices() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: 'General Practice',
        duration: 30,
    });

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            setLoading(true);
            const data = await serviceService.getMyServices();
            setServices(data.data);
        } catch (err) {
            setError('Failed to load services');
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
        try {
            if (editingService) {
                await serviceService.update(editingService._id, formData);
                alert('Service updated successfully');
            } else {
                await serviceService.create(formData);
                alert('Service created successfully');
            }
            setShowForm(false);
            setEditingService(null);
            setFormData({ name: '', description: '', category: 'General Practice', duration: 30 });
            fetchServices();
        } catch (err) {
            alert(err.response?.data?.error || 'Operation failed');
        }
    };

    const handleEdit = (service) => {
        setEditingService(service);
        setFormData({
            name: service.name,
            description: service.description,
            category: service.category,
            duration: service.duration,
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this service?')) return;

        try {
            await serviceService.delete(id);
            alert('Service deleted successfully');
            fetchServices();
        } catch (err) {
            alert('Failed to delete service');
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingService(null);
        setFormData({ name: '', description: '', category: 'General Practice', duration: 30 });
    };

    if (loading) return <div className="loading">Loading...</div>;

    return (
        <div className="provider-services-container">
            <div className="header">
                <h1>My Medical Services</h1>
                {!showForm && (
                    <button className="btn-primary" onClick={() => setShowForm(true)}>
                        + Add New Service
                    </button>
                )}
            </div>

            {error && <div className="error-message">{error}</div>}

            {showForm && (
                <div className="service-form-card">
                    <h3>{editingService ? 'Edit Service' : 'Create New Service'}</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Service Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g., General Checkup, Dental Cleaning"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Describe the medical service..."
                                rows="4"
                                required
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Specialty</label>
                                <select name="category" value={formData.category} onChange={handleChange}>
                                    <option value="General Practice">General Practice</option>
                                    <option value="Cardiology">Cardiology</option>
                                    <option value="Dermatology">Dermatology</option>
                                    <option value="Pediatrics">Pediatrics</option>
                                    <option value="Orthopedics">Orthopedics</option>
                                    <option value="Dentistry">Dentistry</option>
                                    <option value="Ophthalmology">Ophthalmology</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Duration (minutes)</label>
                                <input
                                    type="number"
                                    name="duration"
                                    value={formData.duration}
                                    onChange={handleChange}
                                    min="15"
                                    max="480"
                                    required
                                />
                            </div>
                        </div>

                        <div className="button-group">
                            <button type="button" className="btn-secondary" onClick={handleCancel}>
                                Cancel
                            </button>
                            <button type="submit" className="btn-primary">
                                {editingService ? 'Update Service' : 'Create Service'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="services-grid">
                {services.length === 0 ? (
                    <p className="no-data">No services created yet. Add your first medical service!</p>
                ) : (
                    services.map((service) => (
                        <div key={service._id} className="service-card">
                            <div className="service-header">
                                <h3>{service.name}</h3>
                                <span className={`status-badge ${service.isActive ? 'active' : 'inactive'}`}>
                                    {service.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                            <p className="category">🏥 {service.category}</p>
                            <p className="description">{service.description}</p>
                            <p className="duration">⏱️ {service.duration} minutes</p>

                            <div className="service-actions">
                                <button className="btn-edit" onClick={() => handleEdit(service)}>
                                    Edit
                                </button>
                                <button className="btn-delete" onClick={() => handleDelete(service._id)}>
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default ProviderServices;
