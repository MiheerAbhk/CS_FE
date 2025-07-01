import React, { useEffect, useState } from 'react';
import axios from '../api/axios';

const ManageAirline = () => {
    const [airline, setAirline] = useState(null);
    const [formData, setFormData] = useState({
        airlineName: '',
        airlineCode: ''
    });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem('token');

    const fetchAirline = async () => {
        try {
            const res = await axios.get('/Airlines/my-airline', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAirline(res.data);
        } catch (err) {
            // No airline found - this is expected for new flight owners
            setAirline(null);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleCreateAirline = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/Airlines', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage('Airline created successfully!');
            fetchAirline(); // Refresh airline data
        } catch (err) {
            console.error('Error creating airline:', err);
            setMessage('Failed to create airline. Please try again.');
        }
    };

    useEffect(() => {
        fetchAirline();
    }, []);

    if (loading) {
        return (
            <div className="container mt-4">
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Manage Airline</h2>

            {airline ? (
                <div className="card">
                    <div className="card-header bg-success text-white">
                        <h4 className="mb-0">
                            <i className="fas fa-plane me-2"></i>
                            Your Airline Details
                        </h4>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-6">
                                <h5>Airline Information</h5>
                                <p><strong>Name:</strong> {airline.airlineName}</p>
                                <p><strong>Code:</strong> {airline.airlineCode}</p>
                                <p><strong>Status:</strong> <span className="badge bg-success">Active</span></p>
                            </div>
                            <div className="col-md-6">
                                <h5>Quick Actions</h5>
                                <div className="d-grid gap-2">
                                    <a href="/flight-owner/flights" className="btn btn-primary">
                                        <i className="fas fa-plane me-2"></i>
                                        Manage Flights
                                    </a>
                                    <button className="btn btn-outline-secondary" disabled>
                                        <i className="fas fa-edit me-2"></i>
                                        Edit Airline (Coming Soon)
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="card">
                    <div className="card-header">
                        <h4>Create Your Airline</h4>
                        <p className="mb-0 text-muted">Set up your airline to start managing flights</p>
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleCreateAirline}>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Airline Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="airlineName"
                                        value={formData.airlineName}
                                        onChange={handleInputChange}
                                        placeholder="e.g., IndiGo Airlines"
                                        required
                                    />
                                    <div className="form-text">Enter the full name of your airline</div>
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Airline Code</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="airlineCode"
                                        value={formData.airlineCode}
                                        onChange={handleInputChange}
                                        placeholder="e.g., 6E"
                                        maxLength="3"
                                        style={{ textTransform: 'uppercase' }}
                                        required
                                    />
                                    <div className="form-text">2-3 character airline code (IATA format)</div>
                                </div>
                            </div>

                            <button type="submit" className="btn btn-primary btn-lg">
                                <i className="fas fa-plus me-2"></i>
                                Create Airline
                            </button>
                        </form>

                        {message && (
                            <div className={`alert ${message.includes('Failed') ? 'alert-danger' : 'alert-success'} mt-3`}>
                                <i className={`fas ${message.includes('Failed') ? 'fa-exclamation-triangle' : 'fa-check-circle'} me-2`}></i>
                                {message}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageAirline;