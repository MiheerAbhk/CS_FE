import React, { useEffect, useState } from 'react';
import axios from '../api/axios';

const ManageFlights = () => {
    const [flights, setFlights] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [airline, setAirline] = useState(null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        flightNumber: '',
        flightRouteId: '',
        totalSeats: '',
        departureDate: '',
        departureTime: '',
        arrivalDate: '',
        arrivalTime: ''
    });

    const token = localStorage.getItem('token');

    const fetchData = async () => {
        try {
            const [flightsRes, routesRes, airlineRes] = await Promise.all([
                axios.get('/Flights', { headers: { Authorization: `Bearer ${token}` } }),
                axios.get('/FlightRoutes', { headers: { Authorization: `Bearer ${token}` } }),
                axios.get('/Airlines/my-airline', { headers: { Authorization: `Bearer ${token}` } })
            ]);
            setFlights(flightsRes.data);
            setRoutes(routesRes.data);
            setAirline(airlineRes.data);
        } catch (err) {
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleAddFlight = async (e) => {
        e.preventDefault();

        if (!airline) {
            setMessage('Please create an airline first before adding flights.');
            return;
        }

        // Combine date and time into ISO strings
        const departure = new Date(`${formData.departureDate}T${formData.departureTime}`);
        const arrival = new Date(`${formData.arrivalDate}T${formData.arrivalTime}`);

        try {
            await axios.post('/Flights', {
                flightNumber: formData.flightNumber,
                airlineId: airline.id,
                airlineName: airline.airlineName,
                flightRouteId: parseInt(formData.flightRouteId),
                totalSeats: parseInt(formData.totalSeats),
                departureTime: departure.toISOString(),
                arrivalTime: arrival.toISOString()
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setMessage('✅ Flight added successfully!');
            setFormData({
                flightNumber: '',
                flightRouteId: '',
                totalSeats: '',
                departureDate: '',
                departureTime: '',
                arrivalDate: '',
                arrivalTime: ''
            });

            const flightsRes = await axios.get('/Flights', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFlights(flightsRes.data);
        } catch (err) {
            console.error('❌ Error adding flight:', err);
            if (err.response?.data) {
                console.log('🔎 Server response:', err.response.data);
                setMessage(`Error: ${err.response.data.title || JSON.stringify(err.response.data)}`);
            } else {
                setMessage('Error adding flight. Please check all fields.');
            }
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="container mt-4 text-center">
                <div className="spinner-border" role="status" />
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Manage Flights</h2>

            {!airline ? (
                <div className="alert alert-warning">
                    <strong>You need to create an airline first before managing flights.</strong>
                    <a href="/flight-owner/airline" className="alert-link ms-2">Create Airline</a>
                </div>
            ) : (
                <>
                    <div className="card mb-4">
                        <div className="card-header">
                            <h4>Add New Flight</h4>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleAddFlight}>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Flight Number</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="flightNumber"
                                            value={formData.flightNumber}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Flight Route</label>
                                        <select
                                            className="form-select"
                                            name="flightRouteId"
                                            value={formData.flightRouteId}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="">Select Route</option>
                                            {routes.map(route => (
                                                <option key={route.id} value={route.id}>
                                                    {route.source} → {route.destination} (₹{route.fare})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Total Seats</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            name="totalSeats"
                                            value={formData.totalSeats}
                                            onChange={handleInputChange}
                                            min="1"
                                            max="500"
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Departure Date</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            name="departureDate"
                                            value={formData.departureDate}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Departure Time</label>
                                        <input
                                            type="time"
                                            className="form-control"
                                            name="departureTime"
                                            value={formData.departureTime}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Arrival Date</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            name="arrivalDate"
                                            value={formData.arrivalDate}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Arrival Time</label>
                                        <input
                                            type="time"
                                            className="form-control"
                                            name="arrivalTime"
                                            value={formData.arrivalTime}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-primary">
                                    Add Flight
                                </button>
                            </form>

                            {message && (
                                <div className={`alert mt-3 ${message.startsWith('Error') ? 'alert-danger' : 'alert-success'}`}>
                                    {message}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-header">
                            <h4>Your Flights</h4>
                        </div>
                        <div className="card-body">
                            {flights.length === 0 ? (
                                <p className="text-muted">No flights found. Add one above.</p>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-striped">
                                        <thead>
                                            <tr>
                                                <th>Flight No.</th>
                                                <th>Route</th>
                                                <th>Departure</th>
                                                <th>Arrival</th>
                                                <th>Seats</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {flights.map(flight => (
                                                <tr key={flight.id}>
                                                    <td>{flight.flightNumber}</td>
                                                    <td>{flight.source} → {flight.destination}</td>
                                                    <td>{new Date(flight.departureTime).toLocaleString()}</td>
                                                    <td>{new Date(flight.arrivalTime).toLocaleString()}</td>
                                                    <td>{flight.totalSeats}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default ManageFlights;
