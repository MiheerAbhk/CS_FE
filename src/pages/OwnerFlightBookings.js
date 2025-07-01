import React, { useEffect, useState } from 'react';
import axios from '../api/axios';

const OwnerFlightBookings = () => {
    const [flights, setFlights] = useState([]);
    const [expandedFlightId, setExpandedFlightId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchFlightsWithBookings = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('/Flights/owner/flights-with-bookings', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setFlights(res.data);
            } catch (err) {
                console.error('Error fetching flight bookings:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchFlightsWithBookings();
    }, []);

    const toggleFlightExpand = (flightId) => {
        setExpandedFlightId(prevId => (prevId === flightId ? null : flightId));
    };

    const filteredFlights = flights.filter(flight =>
        flight.flightNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        flight.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
        flight.destination.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getTotalBookings = () => {
        return flights.reduce((total, flight) => total + flight.bookings.length, 0);
    };

    const getConfirmedBookings = () => {
        return flights.reduce((total, flight) => 
            total + flight.bookings.filter(booking => booking.status === 'Confirmed').length, 0);
    };

    const getPendingBookings = () => {
        return flights.reduce((total, flight) => 
            total + flight.bookings.filter(booking => booking.status === 'Pending').length, 0);
    };

    const getCancelledBookings = () => {
        return flights.reduce((total, flight) => 
            total + flight.bookings.filter(booking => booking.status === 'Cancelled').length, 0);
    };

    if (loading) {
        return (
            <div className="container mt-5 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2">Loading your flights and bookings...</p>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <div className="row mb-4">
                <div className="col-12">
                    <h2 className="mb-3">
                        <i className="fas fa-plane me-2"></i>
                        Your Flights & Bookings
                    </h2>
                    <p className="text-muted">Manage and view all bookings for your flights</p>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="row mb-4">
                <div className="col-md-3 mb-3">
                    <div className="card bg-primary text-white">
                        <div className="card-body text-center">
                            <i className="fas fa-plane fa-2x mb-2"></i>
                            <h4>{flights.length}</h4>
                            <p className="mb-0">Total Flights</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 mb-3">
                    <div className="card bg-info text-white">
                        <div className="card-body text-center">
                            <i className="fas fa-ticket-alt fa-2x mb-2"></i>
                            <h4>{getTotalBookings()}</h4>
                            <p className="mb-0">Total Bookings</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 mb-3">
                    <div className="card bg-success text-white">
                        <div className="card-body text-center">
                            <i className="fas fa-check-circle fa-2x mb-2"></i>
                            <h4>{getConfirmedBookings()}</h4>
                            <p className="mb-0">Confirmed</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 mb-3">
                    <div className="card bg-warning text-white">
                        <div className="card-body text-center">
                            <i className="fas fa-clock fa-2x mb-2"></i>
                            <h4>{getPendingBookings()}</h4>
                            <p className="mb-0">Pending</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search Bar */}
            <div className="row mb-4">
                <div className="col-md-6">
                    <div className="input-group">
                        <span className="input-group-text">
                            <i className="fas fa-search"></i>
                        </span>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search flights by number, source, or destination..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {filteredFlights.length === 0 ? (
                <div className="alert alert-info">
                    <i className="fas fa-info-circle me-2"></i>
                    {flights.length === 0 
                        ? 'You have no flights yet. Create flights to start receiving bookings.' 
                        : 'No flights match your search criteria.'}
                </div>
            ) : (
                <div className="accordion" id="flightsAccordion">
                    {filteredFlights.map(flight => (
                        <div className="accordion-item mb-3 shadow-sm" key={flight.flightId}>
                            <h2 className="accordion-header" id={`heading-${flight.flightId}`}>
                                <button
                                    className={`accordion-button ${expandedFlightId === flight.flightId ? '' : 'collapsed'}`}
                                    type="button"
                                    onClick={() => toggleFlightExpand(flight.flightId)}
                                >
                                    <div className="d-flex justify-content-between align-items-center w-100 me-3">
                                        <div>
                                            <strong className="fs-5">{flight.flightNumber}</strong>
                                            <span className="ms-3 text-muted">
                                                {flight.source} → {flight.destination}
                                            </span>
                                        </div>
                                        <div className="d-flex gap-2">
                                            <span className="badge bg-primary">
                                                {flight.totalSeats} seats
                                            </span>
                                            <span className="badge bg-secondary">
                                                {flight.bookings.length} booking{flight.bookings.length !== 1 ? 's' : ''}
                                            </span>
                                            {flight.bookings.filter(b => b.status === 'Confirmed').length > 0 && (
                                                <span className="badge bg-success">
                                                    {flight.bookings.filter(b => b.status === 'Confirmed').length} confirmed
                                                </span>
                                            )}
                                            {flight.bookings.filter(b => b.status === 'Pending').length > 0 && (
                                                <span className="badge bg-warning">
                                                    {flight.bookings.filter(b => b.status === 'Pending').length} pending
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </button>
                            </h2>
                            <div
                                id={`collapse-${flight.flightId}`}
                                className={`accordion-collapse collapse ${expandedFlightId === flight.flightId ? 'show' : ''}`}
                            >
                                <div className="accordion-body">
                                    {/* Flight Details */}
                                    <div className="row mb-4">
                                        <div className="col-md-6">
                                            <h6 className="text-primary">
                                                <i className="fas fa-info-circle me-2"></i>
                                                Flight Information
                                            </h6>
                                            <div className="ms-3">
                                                <p className="mb-1"><strong>Airline:</strong> {flight.airlineName}</p>
                                                <p className="mb-1">
                                                    <strong>Departure:</strong> 
                                                    <span className="ms-2">{new Date(flight.departureTime).toLocaleString()}</span>
                                                </p>
                                                <p className="mb-1">
                                                    <strong>Arrival:</strong> 
                                                    <span className="ms-2">{new Date(flight.arrivalTime).toLocaleString()}</span>
                                                </p>
                                                <p className="mb-0"><strong>Total Seats:</strong> {flight.totalSeats}</p>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <h6 className="text-success">
                                                <i className="fas fa-chart-bar me-2"></i>
                                                Booking Statistics
                                            </h6>
                                            <div className="ms-3">
                                                <p className="mb-1">
                                                    <strong>Total Bookings:</strong> 
                                                    <span className="badge bg-info ms-2">{flight.bookings.length}</span>
                                                </p>
                                                <p className="mb-1">
                                                    <strong>Confirmed:</strong> 
                                                    <span className="badge bg-success ms-2">
                                                        {flight.bookings.filter(b => b.status === 'Confirmed').length}
                                                    </span>
                                                </p>
                                                <p className="mb-1">
                                                    <strong>Pending:</strong> 
                                                    <span className="badge bg-warning ms-2">
                                                        {flight.bookings.filter(b => b.status === 'Pending').length}
                                                    </span>
                                                </p>
                                                <p className="mb-0">
                                                    <strong>Cancelled:</strong> 
                                                    <span className="badge bg-danger ms-2">
                                                        {flight.bookings.filter(b => b.status === 'Cancelled').length}
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bookings Table */}
                                    {flight.bookings.length === 0 ? (
                                        <div className="alert alert-light border">
                                            <i className="fas fa-info-circle me-2 text-muted"></i>
                                            No bookings for this flight yet.
                                        </div>
                                    ) : (
                                        <>
                                            <h6 className="text-dark mb-3">
                                                <i className="fas fa-users me-2"></i>
                                                Passenger Bookings
                                            </h6>
                                            <div className="table-responsive">
                                                <table className="table table-bordered table-striped table-hover">
                                                    <thead className="table-dark">
                                                        <tr>
                                                            <th>Booking ID</th>
                                                            <th>Passenger Details</th>
                                                            <th>Contact Information</th>
                                                            <th>Status</th>
                                                            <th>Seats</th>
                                                            <th>Booking Date</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {flight.bookings.map(booking => (
                                                            <tr key={booking.id}>
                                                                <td>
                                                                    <span className="badge bg-secondary fs-6">
                                                                        #{booking.id}
                                                                    </span>
                                                                </td>
                                                                <td>
                                                                    <div>
                                                                        <strong>{booking.passengerName}</strong>
                                                                        <br />
                                                                        <small className="text-muted">
                                                                            User ID: {booking.userId}
                                                                        </small>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <div>
                                                                        <i className="fas fa-envelope me-2 text-muted"></i>
                                                                        <small>{booking.passengerEmail}</small>
                                                                        <br />
                                                                        <i className="fas fa-phone me-2 text-muted"></i>
                                                                        <small>{booking.passengerPhone}</small>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <span className={`badge fs-6 ${
                                                                        booking.status === 'Confirmed' ? 'bg-success' :
                                                                        booking.status === 'Pending' ? 'bg-warning text-dark' :
                                                                        'bg-danger'
                                                                    }`}>
                                                                        {booking.status}
                                                                    </span>
                                                                </td>
                                                                <td>
                                                                    <div className="d-flex flex-wrap gap-1">
                                                                        {booking.seatNumbers && booking.seatNumbers.length > 0 ? (
                                                                            booking.seatNumbers.map(seat => (
                                                                                <span key={seat} className="badge bg-light text-dark border">
                                                                                    {seat}
                                                                                </span>
                                                                            ))
                                                                        ) : (
                                                                            <span className="text-muted">No seats</span>
                                                                        )}
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <div>
                                                                        {new Date(booking.bookingDate).toLocaleDateString()}
                                                                        <br />
                                                                        <small className="text-muted">
                                                                            {new Date(booking.bookingDate).toLocaleTimeString()}
                                                                        </small>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OwnerFlightBookings;