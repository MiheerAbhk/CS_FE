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
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchFlights = async () => {
            try {
                const res = await axios.get(`/Flights/route/${routeId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setFlights(res.data);

            } catch (err) {
                console.error('Error fetching flights:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchFlights();
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
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <h3 className="mb-4">Available Flights</h3>

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
                                    <h5 className="card-title">{flight.flightNumber}</h5>
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
                    <div className="card-header">
                        <h4>Choose Seats for {selectedFlight.flightNumber}</h4>
                        <p className="mb-0">Selected seats: {selectedSeats.length} |
                            <span className="text-muted ms-2">Click on available seats to select/deselect</span>
                        </p>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-12 mb-3">
                                <div className="d-flex gap-3 align-items-center">
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
                                <p><strong>Selected Seats:</strong> {selectedSeats.join(', ')}</p>
                                <button className="btn btn-success btn-lg" onClick={handleBooking}>
                                    Confirm Booking ({selectedSeats.length} seat{selectedSeats.length > 1 ? 's' : ''})
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