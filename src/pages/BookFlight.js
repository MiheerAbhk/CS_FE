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
    const [error, setError] = useState(null);

    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setError(null);
                console.log('Fetching data for routeId:', routeId);
                
                // First fetch the route information using the routeId from URL
                const routeRes = await axios.get(`/FlightRoutes/${routeId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setRouteInfo(routeRes.data);
                console.log('Route Info:', routeRes.data);

                // Try multiple approaches to fetch flights for this route
                let flightsData = [];
                
                // Approach 1: Try the route-specific endpoint
                try {
                    const flightsRes = await axios.get(`/Flights/route/${routeId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    flightsData = flightsRes.data;
                    console.log('Flights from route endpoint:', flightsData);
                } catch (routeFlightErr) {
                    console.log('Route-specific flights endpoint failed, trying alternative approach...');
                    
                    // Approach 2: Get all flights and filter by route
                    try {
                        const allFlightsRes = await axios.get('/Flights', {
                            headers: { Authorization: `Bearer ${token}` }
                        });
                        
                        // Filter flights that match this route's source and destination
                        flightsData = allFlightsRes.data.filter(flight => 
                            flight.source === routeRes.data.source && 
                            flight.destination === routeRes.data.destination
                        );
                        console.log('All flights:', allFlightsRes.data);
                        console.log('Filtered flights for route:', flightsData);
                    } catch (allFlightsErr) {
                        console.error('Failed to fetch all flights:', allFlightsErr);
                        
                        // Approach 3: Try with flightRouteId filter
                        try {
                            const flightsByRouteIdRes = await axios.get('/Flights', {
                                headers: { Authorization: `Bearer ${token}` },
                                params: { flightRouteId: routeId }
                            });
                            flightsData = flightsByRouteIdRes.data;
                            console.log('Flights by routeId param:', flightsData);
                        } catch (routeIdErr) {
                            console.error('Failed to fetch flights by routeId param:', routeIdErr);
                        }
                    }
                }

                setFlights(flightsData);
                console.log('Final flights data:', flightsData);

            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to load flight and route information. Please try again.');
                
                // Fallback: Try to get route info from all routes if direct fetch fails
                try {
                    const allRoutesRes = await axios.get('/FlightRoutes', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    const route = allRoutesRes.data.find(r => r.id === parseInt(routeId));
                    if (route) {
                        setRouteInfo(route);
                        console.log('Fallback Route Info:', route);
                        
                        // Try to get flights for this route using the fallback route info
                        try {
                            const allFlightsRes = await axios.get('/Flights', {
                                headers: { Authorization: `Bearer ${token}` }
                            });
                            const matchingFlights = allFlightsRes.data.filter(flight => 
                                flight.source === route.source && 
                                flight.destination === route.destination
                            );
                            setFlights(matchingFlights);
                            console.log('Fallback flights:', matchingFlights);
                        } catch (fallbackFlightErr) {
                            console.error('Fallback flight fetch failed:', fallbackFlightErr);
                        }
                    }
                } catch (fallbackErr) {
                    console.error('Fallback route fetch failed:', fallbackErr);
                }
            } finally {
                setLoading(false);
            }
        };

        if (routeId) {
            fetchData();
        }
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
        if (!routeInfo || !routeInfo.fare || selectedSeats.length === 0) return 0;
        return routeInfo.fare * selectedSeats.length;
    };

    const getFarePerSeat = () => {
        return routeInfo?.fare || 0;
    };

    const handleBooking = async () => {
        if (!selectedFlight || selectedSeats.length === 0) {
            alert("Please select a flight and at least one seat.");
            return;
        }

        if (!routeInfo || !routeInfo.fare) {
            alert("Unable to calculate fare. Please refresh the page and try again.");
            return;
        }

        try {
            await axios.post('/Bookings', {
                flightId: selectedFlight.id,
                seatNumbers: selectedSeats
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert(`Booking successful! Total amount: ₹${calculateTotalFare()}. Redirecting to payments...`);
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

    if (error && !routeInfo) {
        return (
            <div className="container mt-4">
                <div className="alert alert-danger">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    {error}
                    <div className="mt-2">
                        <button className="btn btn-primary btn-sm" onClick={() => window.location.reload()}>
                            <i className="fas fa-refresh me-2"></i>
                            Retry
                        </button>
                        <a href="/passenger/search" className="btn btn-secondary btn-sm ms-2">
                            <i className="fas fa-arrow-left me-2"></i>
                            Back to Search
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="mb-0">
                    <i className="fas fa-plane me-2"></i>
                    Available Flights
                </h3>
                <a href="/passenger/search" className="btn btn-outline-secondary">
                    <i className="fas fa-arrow-left me-2"></i>
                    Back to Search
                </a>
            </div>

            {/* Debug Information (remove in production) */}
            <div className="alert alert-info mb-3">
                <small>
                    <strong>Debug Info:</strong> Route ID: {routeId} | 
                    Route Info: {routeInfo ? 'Loaded' : 'Missing'} | 
                    Flights Found: {flights.length}
                </small>
            </div>

            {/* Route Information */}
            {routeInfo && (
                <div className="alert alert-primary mb-4">
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
                                        <strong>Base Fare per seat:</strong> 
                                        <span className="text-success fw-bold ms-1">₹{getFarePerSeat()}</span>
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
                                <div className="bg-white p-3 rounded border shadow-sm">
                                    <h6 className="text-primary mb-1">
                                        <i className="fas fa-calculator me-2"></i>
                                        Your Selection
                                    </h6>
                                    <h4 className="text-success mb-1">₹{calculateTotalFare()}</h4>
                                    <small className="text-muted">
                                        {selectedSeats.length} seat{selectedSeats.length > 1 ? 's' : ''} × ₹{getFarePerSeat()}
                                    </small>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Error message if route info is missing */}
            {!routeInfo && (
                <div className="alert alert-warning mb-4">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    Route information is not available. Fare calculation may not work properly.
                </div>
            )}

            {flights.length === 0 ? (
                <div className="alert alert-warning">
                    <div className="d-flex align-items-center">
                        <i className="fas fa-exclamation-triangle me-3 fa-2x"></i>
                        <div>
                            <h5 className="mb-1">No flights found for this route</h5>
                            <p className="mb-2">
                                {routeInfo ? 
                                    `No flights are currently available for the route ${routeInfo.source} → ${routeInfo.destination}.` :
                                    'Unable to load flight information for this route.'
                                }
                            </p>
                            <div>
                                <a href="/passenger/search" className="btn btn-primary btn-sm me-2">
                                    <i className="fas fa-search me-2"></i>
                                    Search Other Routes
                                </a>
                                <button className="btn btn-outline-secondary btn-sm" onClick={() => window.location.reload()}>
                                    <i className="fas fa-refresh me-2"></i>
                                    Refresh Page
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <div className="alert alert-success mb-4">
                        <i className="fas fa-check-circle me-2"></i>
                        Found {flights.length} flight{flights.length > 1 ? 's' : ''} for this route
                    </div>
                    
                    <div className="row mb-4">
                        {flights.map(flight => (
                            <div key={flight.id} className="col-md-6 col-lg-4 mb-3">
                                <div className="card shadow-sm h-100">
                                    <div className="card-body">
                                        <h5 className="card-title">
                                            <i className="fas fa-plane me-2 text-primary"></i>
                                            {flight.flightNumber}
                                        </h5>
                                        <div className="card-text">
                                            <p className="mb-2">
                                                <i className="fas fa-building me-2 text-muted"></i>
                                                <strong>Airline:</strong> {flight.airlineName}
                                            </p>
                                            <p className="mb-2">
                                                <i className="fas fa-clock me-2 text-muted"></i>
                                                <strong>Departure:</strong><br />
                                                <small>{new Date(flight.departureTime).toLocaleString()}</small>
                                            </p>
                                            <p className="mb-2">
                                                <i className="fas fa-clock me-2 text-muted"></i>
                                                <strong>Arrival:</strong><br />
                                                <small>{new Date(flight.arrivalTime).toLocaleString()}</small>
                                            </p>
                                            <p className="mb-2">
                                                <i className="fas fa-chair me-2 text-muted"></i>
                                                <strong>Total Seats:</strong> {flight.totalSeats}
                                            </p>
                                            {routeInfo && (
                                                <p className="mb-0">
                                                    <i className="fas fa-rupee-sign me-2 text-success"></i>
                                                    <strong>Fare per seat:</strong> 
                                                    <span className="text-success fw-bold">₹{getFarePerSeat()}</span>
                                                </p>
                                            )}
                                        </div>
                                        <button
                                            className="btn btn-primary w-100 mt-3"
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
                </>
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
                                            <p className="mb-1">
                                                <strong>Fare per seat:</strong> 
                                                <span className="text-success fw-bold ms-1">₹{getFarePerSeat()}</span>
                                            </p>
                                            <p className="mb-1">
                                                <strong>Total Amount:</strong> 
                                                <span className="text-success fw-bold fs-5 ms-1">₹{calculateTotalFare()}</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <button 
                                    className="btn btn-success btn-lg" 
                                    onClick={handleBooking}
                                    disabled={!routeInfo || !routeInfo.fare}
                                >
                                    <i className="fas fa-credit-card me-2"></i>
                                    Confirm Booking - ₹{calculateTotalFare()}
                                </button>
                                {(!routeInfo || !routeInfo.fare) && (
                                    <div className="mt-2">
                                        <small className="text-danger">
                                            <i className="fas fa-exclamation-triangle me-1"></i>
                                            Unable to calculate fare. Please refresh the page.
                                        </small>
                                    </div>
                                )}
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