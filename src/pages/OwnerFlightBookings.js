import React, { useEffect, useState } from 'react';
import axios from '../api/axios';

const OwnerFlightBookings = () => {
    const [flights, setFlights] = useState([]);
    const [expandedFlightId, setExpandedFlightId] = useState(null);
    const [loading, setLoading] = useState(true);

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

    if (loading) {
        return (
            <div className="container mt-5 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Your Flights and Bookings</h2>

            {flights.length === 0 ? (
                <div className="alert alert-info">
                    You have no flights or bookings yet.
                </div>
            ) : (
                <div className="accordion" id="flightsAccordion">
                    {flights.map(flight => (
                        <div className="accordion-item mb-3" key={flight.flightId}>
                            <h2 className="accordion-header" id={`heading-${flight.flightId}`}>
                                <button
                                    className={`accordion-button ${expandedFlightId === flight.flightId ? '' : 'collapsed'}`}
                                    type="button"
                                    onClick={() => toggleFlightExpand(flight.flightId)}
                                >
                                    {flight.flightNumber} - {flight.source} → {flight.destination}
                                    <span className="ms-auto badge bg-secondary">
                                        Bookings: {flight.bookings.length}
                                    </span>
                                </button>
                            </h2>
                            <div
                                id={`collapse-${flight.flightId}`}
                                className={`accordion-collapse collapse ${expandedFlightId === flight.flightId ? 'show' : ''}`}
                            >
                                <div className="accordion-body">
                                    <p><strong>Airline:</strong> {flight.airlineName}</p>
                                    <p><strong>Departure:</strong> {new Date(flight.departureTime).toLocaleString()}</p>
                                    <p><strong>Arrival:</strong> {new Date(flight.arrivalTime).toLocaleString()}</p>
                                    <p><strong>Total Seats:</strong> {flight.totalSeats}</p>

                                    {flight.bookings.length === 0 ? (
                                        <div className="alert alert-warning">No bookings for this flight.</div>
                                    ) : (
                                        <div className="table-responsive">
                                            <table className="table table-bordered table-striped table-hover">
                                                <thead className="table-dark">
                                                    <tr>
                                                        <th>Booking ID</th>
                                                        <th>Passenger</th>
                                                        <th>Contact</th>
                                                        <th>Status</th>
                                                        <th>Seats</th>
                                                        <th>Booked On</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {flight.bookings.map(booking => (
                                                        <tr key={booking.id}>
                                                            <td>{booking.id}</td>
                                                            <td>{booking.passengerName}</td>
                                                            <td>
                                                                <i className="fas fa-envelope me-2 text-muted"></i>{booking.passengerEmail}
                                                                <br />
                                                                <i className="fas fa-phone me-2 text-muted"></i>{booking.passengerPhone}
                                                            </td>
                                                            <td>
                                                                <span className={`badge 
                                                                    ${booking.status === 'Confirmed' ? 'bg-success' :
                                                                        booking.status === 'Pending' ? 'bg-warning' :
                                                                            'bg-danger'}`}>
                                                                    {booking.status}
                                                                </span>
                                                            </td>
                                                            <td>{booking.seatNumbers?.join(', ')}</td>
                                                            <td>
                                                                {new Date(booking.bookingDate).toLocaleDateString()}<br />
                                                                <small className="text-muted">{new Date(booking.bookingDate).toLocaleTimeString()}</small>
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
                    ))}
                </div>
            )}
        </div>
    );
};

export default OwnerFlightBookings;
