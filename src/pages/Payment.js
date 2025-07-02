import React, { useEffect, useState } from 'react';
import axios from '../api/axios';

const Payment = () => {
    const [pendingBookings, setPendingBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchPendingBookings = async () => {
            try {
                const res = await axios.get('/Bookings', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const pending = res.data.filter(b => b.bookingStatus === 'Pending');
                
                // Fetch route information for each booking to get the fare
                const bookingsWithFare = await Promise.all(
                    pending.map(async (booking) => {
                        try {
                            // Get flight details to find route ID
                            const flightRes = await axios.get(`/Flights/${booking.flightId}`, {
                                headers: { Authorization: `Bearer ${token}` }
                            });
                            
                            // Get route details to get fare
                            const routeRes = await axios.get(`/FlightRoutes/${flightRes.data.flightRouteId}`, {
                                headers: { Authorization: `Bearer ${token}` }
                            });
                            
                            return {
                                ...booking,
                                fare: routeRes.data.fare,
                                routeInfo: routeRes.data,
                                flightInfo: flightRes.data
                            };
                        } catch (err) {
                            console.error('Error fetching fare for booking:', booking.id, err);
                            
                            // Try to get fare from FlightRoutes API directly
                            try {
                                const allRoutesRes = await axios.get('/FlightRoutes', {
                                    headers: { Authorization: `Bearer ${token}` }
                                });
                                
                                // Find the route that matches this booking's source and destination
                                const matchingRoute = allRoutesRes.data.find(route => 
                                    route.source === booking.source && route.destination === booking.destination
                                );
                                
                                if (matchingRoute) {
                                    return {
                                        ...booking,
                                        fare: matchingRoute.fare,
                                        routeInfo: matchingRoute,
                                        flightInfo: null
                                    };
                                }
                            } catch (routeErr) {
                                console.error('Error fetching routes:', routeErr);
                            }
                            
                            // Final fallback to a default fare if all API calls fail
                            return {
                                ...booking,
                                fare: 2500, // Default fallback fare
                                routeInfo: null,
                                flightInfo: null
                            };
                        }
                    })
                );
                
                setPendingBookings(bookingsWithFare);
            } catch (err) {
                console.error('Error fetching bookings:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchPendingBookings();
    }, [token]);

    const calculateTotalAmount = (booking) => {
        const seatCount = booking.seatNumbers?.length || 1;
        const farePerSeat = booking.fare || 2500; // Fallback fare
        return farePerSeat * seatCount;
    };

    const handlePayment = async (bookingId, paymentMethod = 'Credit Card') => {
        try {
            await axios.post('/Payments', {
                bookingId,
                paymentMethod
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert("Payment successful! Your booking has been confirmed.");
            setPendingBookings(prev => prev.filter(b => b.id !== bookingId));
        } catch (err) {
            console.error('Payment error:', err);
            alert("Payment failed. Please try again.");
        }
    };

    if (loading) {
        return (
            <div className="container mt-4">
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">Loading payment information...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <h3 className="mb-4">
                <i className="fas fa-credit-card me-2"></i>
                Pending Payments
            </h3>

            {pendingBookings.length === 0 ? (
                <div className="alert alert-success">
                    <i className="fas fa-check-circle me-2"></i>
                    No pending payments. All your bookings are up to date!
                    <div className="mt-2">
                        <a href="/passenger/search" className="btn btn-primary btn-sm">
                            <i className="fas fa-search me-2"></i>
                            Search for new flights
                        </a>
                    </div>
                </div>
            ) : (
                <div className="row">
                    {pendingBookings.map(booking => (
                        <div key={booking.id} className="col-md-6 col-lg-4 mb-4">
                            <div className="card shadow-sm h-100">
                                <div className="card-header bg-warning text-dark">
                                    <h6 className="mb-0">
                                        <i className="fas fa-exclamation-triangle me-2"></i>
                                        Payment Required
                                    </h6>
                                </div>
                                <div className="card-body">
                                    <h5 className="card-title">
                                        <i className="fas fa-plane me-2"></i>
                                        {booking.flightNumber}
                                    </h5>
                                    <p className="card-text">
                                        <i className="fas fa-route me-2"></i>
                                        <strong>Route:</strong> {booking.source} → {booking.destination}
                                    </p>
                                    <p className="card-text">
                                        <i className="fas fa-chair me-2"></i>
                                        <strong>Seats:</strong> {booking.seatNumbers?.join(', ') || 'N/A'}
                                        <span className="badge bg-info ms-2">
                                            {booking.seatNumbers?.length || 1} seat{(booking.seatNumbers?.length || 1) > 1 ? 's' : ''}
                                        </span>
                                    </p>
                                    <p className="card-text">
                                        <i className="fas fa-calendar me-2"></i>
                                        <strong>Booking Date:</strong> {new Date(booking.bookingDate).toLocaleDateString()}
                                    </p>

                                    {/* Fare Breakdown */}
                                    <div className="alert alert-light border">
                                        <h6 className="mb-2">
                                            <i className="fas fa-calculator me-2"></i>
                                            Fare Breakdown
                                        </h6>
                                        <div className="d-flex justify-content-between">
                                            <span>Fare per seat:</span>
                                            <span className="fw-bold">₹{booking.fare}</span>
                                        </div>
                                        <div className="d-flex justify-content-between">
                                            <span>Number of seats:</span>
                                            <span className="fw-bold">{booking.seatNumbers?.length || 1}</span>
                                        </div>
                                        <hr className="my-2" />
                                        <div className="d-flex justify-content-between fw-bold text-primary">
                                            <span>Total Amount:</span>
                                            <span className="fs-5">₹{calculateTotalAmount(booking)}</span>
                                        </div>
                                    </div>

                                    <div className="d-grid gap-2">
                                        <button
                                            className="btn btn-success"
                                            onClick={() => handlePayment(booking.id, 'Credit Card')}
                                        >
                                            <i className="fas fa-credit-card me-2"></i>
                                            Pay ₹{calculateTotalAmount(booking)} - Credit Card
                                        </button>
                                        <button
                                            className="btn btn-outline-success"
                                            onClick={() => handlePayment(booking.id, 'Debit Card')}
                                        >
                                            <i className="fas fa-credit-card me-2"></i>
                                            Pay ₹{calculateTotalAmount(booking)} - Debit Card
                                        </button>
                                        <button
                                            className="btn btn-outline-success"
                                            onClick={() => handlePayment(booking.id, 'UPI')}
                                        >
                                            <i className="fas fa-mobile-alt me-2"></i>
                                            Pay ₹{calculateTotalAmount(booking)} - UPI
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Payment;