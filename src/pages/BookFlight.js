import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';

const BookFlight = () => {
    const { routeId } = useParams();
    const navigate = useNavigate();
    const [flights, setFlights] = useState([]);
    const [selectedFlight, setSelectedFlight] = useState(null);
    const [availableSeats, setAvailableSeats] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [routeInfo, setRouteInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchData = async () => {
            try {
                // First fetch the route information using the routeId from URL
                const routeRes = await axios.get(`/FlightRoutes/${routeId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setRouteInfo(routeRes.data);

                // Then fetch flights for this route
                const flightsRes = await axios.get(`/Flights/route/${routeId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setFlights(flightsRes.data);

            } catch (err) {
                console.error('Error fetching data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [routeId, token]);

    const handleViewSeats = async (flightId) => {
        try {
            const res = await axios.get(`/Bookings/flight/${flightId}/seats`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSelectedFlight(flights.find(f => f.id === flightId));
            setAvailableSeats(res.data.availableSeats);
            setSelectedSeats([]);
        } catch (err) {
            console.error('Error fetching seats:', err);
            alert('Failed to load seat information.');
        }
    };

    const toggleSeatSelection = (seatNumber) => {
        if (selectedSeats.includes(seatNumber)) {
            setSelectedSeats(selectedSeats.filter(s => s !== seatNumber));
        } else {
            setSelectedSeats([...selectedSeats, seatNumber]);
        }
    };

    const calculateTotalFare = () => {
        if (!routeInfo || selectedSeats.length === 0) return 0;
        return routeInfo.fare * selectedSeats.length;
    };

    const handleBooking = async () => {
        if (!selectedFlight || selectedSeats.length === 0) {
            alert("Please select a flight and at least one seat.");
            return;
        }

        try {
            await axios.post('/Bookings', {
                flightId: selectedFlight.id,
                seatNumbers: selectedSeats
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert("Booking successful! Redirecting to payments...");
            navigate('/passenger/payments');
        } catch (err) {
            console.error('Booking error:', err);
            alert("Booking failed. Please try again.");
        }
    };

    if (loading) {
        return (
            <div className="container mt-4">
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">Loading flights and route information...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <h3 className="mb-4">
                <i className="fas fa-plane me-2"></i>
                Available Flights
            </h3>

            {/* Route Information */}
            {routeInfo && (
                <div className="alert alert-info mb-4">
                    <div className="row align-items-center">
                        <div className="col-md-8">
                            <h5 className="alert-heading mb-2">
                                <i className="fas fa-route me-2"></i>
                                {routeInfo.source} → {routeInfo.destination}
                            </h5>
                            <div className="row">
                                <div className="col-sm-6">
                                    <p className="mb-1">
                                        <i className="fas fa-rupee-sign me-2"></i>
                                        <strong>Base Fare per seat:</strong> ₹{routeInfo.fare}
                                    </p>
                                </div>
                                <div className="col-sm-6">
                                    <p className="mb-1">
                                        <i className="fas fa-suitcase me-2"></i>
                                        <strong>Baggage:</strong> {routeInfo.baggageCheckInKg}kg + {routeInfo.cabinBagKg}kg cabin
                                    </p>
                                </div>
                            </div>
                        </div>
                        {selectedSeats.length > 0 && (
                            <div className="col-md-4 text-end">
                                <div className="bg-white p-3 rounded border">
                                    <h6 className="text-primary mb-1">Your Selection</h6>
                                    <h4 className="text-success mb-1">₹{calculateTotalFare()}</h4>
                                    <small className="text-muted">
                                        {selectedSeats.length} seat{selectedSeats.length > 1 ? 's' : ''} × ₹{routeInfo.fare}
                                    </small>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {flights.length === 0 ? (
                <div className="alert alert-warning">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    No flights found for this route.
                </div>
            ) : (
                <div className="row mb-4">
                    {flights.map(flight => (
                        <div key={flight.id} className="col-md-6 mb-3">
                            <div className="card shadow-sm">
                                <div className="card-body">
                                    <h5 className="card-title">
                                        <i className="fas fa-plane me-2"></i>
                                        {flight.flightNumber}
                                    </h5>
                                    <p className="card-text">
                                        <strong>Airline:</strong> {flight.airlineName}<br />
                                        <strong>Departure:</strong> {new Date(flight.departureTime).toLocaleString()}<br />
                                        <strong>Arrival:</strong> {new Date(flight.arrivalTime).toLocaleString()}<br />
                                        <strong>Total Seats:</strong> {flight.totalSeats}
                                    </p>
                                    <button
                                        className="btn btn-primary w-100"
                                        onClick={() => handleViewSeats(flight.id)}
                                    >
                                        <i className="fas fa-chair me-2"></i>
                                        Select Seats
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {selectedFlight && (
                <div className="card mt-4">
                    <div className="card-header bg-primary text-white">
                        <h4 className="mb-0">
                            <i className="fas fa-chair me-2"></i>
                            Choose Seats for {selectedFlight.flightNumber}
                        </h4>
                        <p className="mb-0 mt-2">
                            Selected seats: {selectedSeats.length} |
                            <span className="ms-2">Click on available seats to select/deselect</span>
                        </p>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-12 mb-3">
                                <div className="d-flex gap-3 align-items-center justify-content-center">
                                    <div className="d-flex align-items-center">
                                        <div className="seat-legend available me-2"></div>
                                        <small>Available</small>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <div className="seat-legend selected me-2"></div>
                                        <small>Selected</small>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <div className="seat-legend booked me-2"></div>
                                        <small>Booked</small>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="seat-map d-flex flex-wrap gap-2 justify-content-center">
                            {availableSeats.map(seat => (
                                <div
                                    key={seat.seatNumber}
                                    className={`seat ${seat.isBooked ? 'booked' : selectedSeats.includes(seat.seatNumber) ? 'selected' : 'available'}`}
                                    onClick={() => !seat.isBooked && toggleSeatSelection(seat.seatNumber)}
                                    title={seat.isBooked ? 'Seat is booked' : 'Click to select/deselect'}
                                >
                                    {seat.seatNumber}
                                </div>
                            ))}
                        </div>

                        {selectedSeats.length > 0 && (
                            <div className="mt-4 text-center">
                                <div className="alert alert-success">
                                    <h6 className="mb-2">
                                        <i className="fas fa-check-circle me-2"></i>
                                        Booking Summary
                                    </h6>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <p className="mb-1"><strong>Selected Seats:</strong> {selectedSeats.join(', ')}</p>
                                            <p className="mb-1"><strong>Flight:</strong> {selectedFlight.flightNumber}</p>
                                        </div>
                                        <div className="col-md-6">
                                            <p className="mb-1"><strong>Fare per seat:</strong> ₹{routeInfo?.fare || 0}</p>
                                            <p className="mb-1"><strong>Total Amount:</strong> <span className="text-success fw-bold">₹{calculateTotalFare()}</span></p>
                                        </div>
                                    </div>
                                </div>
                                <button className="btn btn-success btn-lg" onClick={handleBooking}>
                                    <i className="fas fa-credit-card me-2"></i>
                                    Confirm Booking - ₹{calculateTotalFare()}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <style jsx>{`
        .seat {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid #ddd;
          border-radius: 8px;
          font-size: 12px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .seat.available {
          background-color: #f8f9fa;
          border-color: #28a745;
        }
        
        .seat.available:hover {
          background-color: #e9ecef;
          transform: scale(1.05);
        }
        
        .seat.selected {
          background-color: #28a745;
          color: white;
          border-color: #1e7e34;
        }
        
        .seat.booked {
          background-color: #dc3545;
          color: white;
          border-color: #c82333;
          cursor: not-allowed;
        }
        
        .seat-legend {
          width: 20px;
          height: 20px;
          border-radius: 4px;
          border: 1px solid #ddd;
        }
        
        .seat-legend.available {
          background-color: #f8f9fa;
          border-color: #28a745;
        }
        
        .seat-legend.selected {
          background-color: #28a745;
        }
        
        .seat-legend.booked {
          background-color: #dc3545;
        }
      `}</style>
        </div>
    );
};

export default BookFlight;