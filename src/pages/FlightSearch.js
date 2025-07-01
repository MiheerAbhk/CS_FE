import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { Link } from 'react-router-dom';

const FlightSearch = () => {
    const [routes, setRoutes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchRoutes = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('/FlightRoutes', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setRoutes(res.data);
        } catch (err) {
            console.error('Error fetching routes:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRoutes();
    }, []);

    const filteredRoutes = routes.filter(route =>
        route.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
        route.destination.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
        <div className="container mt-4">
            <h3 className="mb-4">Search Flight Routes</h3>

            <div className="row mb-4">
                <div className="col-md-6">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by source or destination city..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {filteredRoutes.length === 0 ? (
                <div className="alert alert-info">
                    <i className="fas fa-info-circle me-2"></i>
                    No flight routes found matching your search.
                </div>
            ) : (
                <div className="row">
                    {filteredRoutes.map((route) => (
                        <div key={route.id} className="col-md-6 col-lg-4 mb-3">
                            <div className="card h-100 shadow-sm">
                                <div className="card-body">
                                    <h5 className="card-title">
                                        {route.source} → {route.destination}
                                    </h5>
                                    <div className="card-text">
                                        <p className="mb-2">
                                            <i className="fas fa-clock me-2"></i>
                                            <strong>Departure:</strong> {new Date(route.departureTime).toLocaleString()}
                                        </p>
                                        <p className="mb-2">
                                            <i className="fas fa-clock me-2"></i>
                                            <strong>Arrival:</strong> {new Date(route.arrivalTime).toLocaleString()}
                                        </p>
                                        <p className="mb-2">
                                            <i className="fas fa-rupee-sign me-2"></i>
                                            <strong>Fare:</strong> ₹{route.fare}
                                        </p>
                                        <p className="mb-2">
                                            <i className="fas fa-suitcase me-2"></i>
                                            <strong>Baggage:</strong> {route.baggageCheckInKg}kg + {route.cabinBagKg}kg cabin
                                        </p>
                                    </div>
                                    <Link
                                        to={`/passenger/book/${route.id}`}
                                        className="btn btn-primary w-100"
                                    >
                                        View Available Flights
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FlightSearch;