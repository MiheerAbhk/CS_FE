import React, { useEffect, useState } from 'react';
import axios from '../api/axios';

const ManageRoutes = () => {
    const [routes, setRoutes] = useState([]);
    const [formData, setFormData] = useState({
        source: '',
        destination: '',
        departureTime: '',
        arrivalTime: '',
        fare: '',
        baggageCheckInKg: '20',
        cabinBagKg: '7'
    });
    const [editingRoute, setEditingRoute] = useState(null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem('token');

    const fetchRoutes = async () => {
        try {
            const res = await axios.get('/FlightRoutes', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRoutes(res.data);
        } catch (err) {
            console.error('Error fetching routes:', err);
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        const routeData = {
            source: formData.source,
            destination: formData.destination,
            //departureTime: formData.departureTime,
            //arrivalTime: formData.arrivalTime,
            fare: parseFloat(formData.fare),
            baggageCheckInKg: parseInt(formData.baggageCheckInKg),
            cabinBagKg: parseInt(formData.cabinBagKg)
        };

        try {
            if (editingRoute) {
                await axios.put(`/FlightRoutes/${editingRoute.id}`, routeData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setMessage('Route updated successfully!');
                setEditingRoute(null);
            } else {
                await axios.post('/FlightRoutes', routeData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setMessage('Route created successfully!');
            }

            setFormData({
                source: '',
                destination: '',
                departureTime: '',
                arrivalTime: '',
                fare: '',
                baggageCheckInKg: '20',
                cabinBagKg: '7'
            });

            fetchRoutes(); // Refresh routes list
        } catch (err) {
            console.error('Error saving route:', err);
            setMessage('Error saving route. Please try again.');
        }
    };

    const handleEdit = (route) => {
        setEditingRoute(route);
        setFormData({
            source: route.source,
            destination: route.destination,
            departureTime: route.departureTime.slice(0, 16), // Format for datetime-local
            arrivalTime: route.arrivalTime.slice(0, 16),
            fare: route.fare.toString(),
            baggageCheckInKg: route.baggageCheckInKg.toString(),
            cabinBagKg: route.cabinBagKg.toString()
        });
    };

    const cancelEdit = () => {
        setEditingRoute(null);
        setFormData({
            source: '',
            destination: '',
            departureTime: '',
            arrivalTime: '',
            fare: '',
            baggageCheckInKg: '20',
            cabinBagKg: '7'
        });
    };

    useEffect(() => {
        fetchRoutes();
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
            <h2 className="mb-4">Manage Flight Routes</h2>

            <div className="card mb-4">
                <div className="card-header">
                    <h4>{editingRoute ? 'Edit Route' : 'Add New Route'}</h4>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Source City</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="source"
                                    value={formData.source}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Delhi"
                                    required
                                />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label">Destination City</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="destination"
                                    value={formData.destination}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Mumbai"
                                    required
                                />
                            </div>

                            {/*<div className="col-md-6 mb-3">*/}
                            {/*    <label className="form-label">Departure Time</label>*/}
                            {/*    <input*/}
                            {/*        type="datetime-local"*/}
                            {/*        className="form-control"*/}
                            {/*        name="departureTime"*/}
                            {/*        value={formData.departureTime}*/}
                            {/*        onChange={handleInputChange}*/}
                            {/*        required*/}
                            {/*    />*/}
                            {/*</div>*/}

                            {/*<div className="col-md-6 mb-3">*/}
                            {/*    <label className="form-label">Arrival Time</label>*/}
                            {/*    <input*/}
                            {/*        type="datetime-local"*/}
                            {/*        className="form-control"*/}
                            {/*        name="arrivalTime"*/}
                            {/*        value={formData.arrivalTime}*/}
                            {/*        onChange={handleInputChange}*/}
                            {/*        required*/}
                            {/*    />*/}
                            {/*</div>*/}

                            <div className="col-md-4 mb-3">
                                <label className="form-label">Fare (₹)</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="fare"
                                    value={formData.fare}
                                    onChange={handleInputChange}
                                    step="0.01"
                                    min="0"
                                    placeholder="3500.50"
                                    required
                                />
                            </div>

                            <div className="col-md-4 mb-3">
                                <label className="form-label">Check-in Baggage (kg)</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="baggageCheckInKg"
                                    value={formData.baggageCheckInKg}
                                    onChange={handleInputChange}
                                    min="0"
                                    max="50"
                                    required
                                />
                            </div>

                            <div className="col-md-4 mb-3">
                                <label className="form-label">Cabin Baggage (kg)</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="cabinBagKg"
                                    value={formData.cabinBagKg}
                                    onChange={handleInputChange}
                                    min="0"
                                    max="15"
                                    required
                                />
                            </div>
                        </div>

                        <div className="d-flex gap-2">
                            <button type="submit" className="btn btn-primary">
                                <i className={`fas ${editingRoute ? 'fa-save' : 'fa-plus'} me-2`}></i>
                                {editingRoute ? 'Update Route' : 'Add Route'}
                            </button>

                            {editingRoute && (
                                <button type="button" className="btn btn-secondary" onClick={cancelEdit}>
                                    <i className="fas fa-times me-2"></i>
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>

                    {message && (
                        <div className={`alert ${message.includes('Error') ? 'alert-danger' : 'alert-success'} mt-3`}>
                            {message}
                        </div>
                    )}
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <h4>Existing Routes</h4>
                </div>
                <div className="card-body">
                    {routes.length === 0 ? (
                        <p className="text-muted">No routes found. Add your first route above.</p>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Route</th>
                                        {/*<th>Departure</th>*/}
                                        {/*<th>Arrival</th>*/}
                                        <th>Fare</th>
                                        <th>Baggage</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {routes.map(route => (
                                        <tr key={route.id}>
                                            <td>
                                                <strong>{route.source} → {route.destination}</strong>
                                            </td>
                                            {/*<td>{new Date(route.departureTime).toLocaleString()}</td>*/}
                                            {/*<td>{new Date(route.arrivalTime).toLocaleString()}</td>*/}
                                            <td>₹{route.fare}</td>
                                            <td>
                                                <small>
                                                    Check-in: {route.baggageCheckInKg}kg<br />
                                                    Cabin: {route.cabinBagKg}kg
                                                </small>
                                            </td>
                                            <td>
                                                <button
                                                    className="btn btn-sm btn-outline-primary me-2"
                                                    onClick={() => handleEdit(route)}
                                                >
                                                    <i className="fas fa-edit"></i>
                                                </button>
                                                <button className="btn btn-sm btn-outline-danger">
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManageRoutes;